import { Injectable, inject } from '@angular/core';
import { LibraryEntryNode, LibraryImportResults } from '@wbs/core/models';
import { IdService, sorter } from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LibraryImportProcessorService {
  private readonly entryService = inject(EntryService);
  private readonly store = inject(EntryStore);
  private readonly taskService = inject(EntryTaskService);

  importAsync(
    taskId: string,
    dir: string,
    results: LibraryImportResults
  ): Observable<void> {
    const entry = this.store.entry()!;
    const version = this.store.version()!;
    const tasks = this.store.tasks()!;
    const fromTask = tasks.find((t) => t.id === taskId)!;
    const allSiblings = tasks
      .filter((x) => x.parentId === fromTask.parentId)
      .sort((a, b) => sorter(a.order, b.order));
    const upserts: LibraryEntryNode[] = [];
    let startOrder =
      dir === 'right'
        ? tasks.filter((x) => x.parentId === fromTask.id).length + 1
        : fromTask.order + (dir === 'above' ? -1 : 1);

    if (startOrder < 1) startOrder = 1;
    if (dir != 'right') {
      //
      //    Let's start by reordering the sibling sure to subtract by 1 for index purposes
      //
      for (let i = startOrder - 1; i < allSiblings.length; i++) {
        allSiblings[i].order++;

        upserts.push(allSiblings[i]);
      }
    }
    if (results.importDisciplines) {
      //
      //  Let's make sure all disciplines added to the task are now in the project.
      //
      for (const discipline of results.version.disciplines) {
        if (discipline.isCustom) {
          let name = discipline.label;
          let found = false;

          for (const pDiscipline of version.disciplines) {
            if (!pDiscipline.isCustom) continue;
            if (pDiscipline.label === name) {
              found = true;
              break;
            }
          }
          if (!found) {
            version.disciplines.push(discipline);
          }
        } else if (!version.disciplines.find((x) => x.id === discipline.id)) {
          version.disciplines.push(discipline);
        }
      }
    }

    const run = (
      task: LibraryEntryNode,
      parentId: string | undefined,
      order: number,
      addLink: boolean
    ) => {
      const newTask: LibraryEntryNode = {
        id: IdService.generate(),
        parentId,
        order: order,
        title: task.title,
        description: task.description,
        disciplineIds: task.disciplineIds,
        phaseIdAssociation: task.phaseIdAssociation,
        lastModified: new Date(),
        libraryLink: addLink
          ? {
              owner: results.owner,
              entryId: results.version.entryId,
              version: results.version.version,
            }
          : undefined,
      };
      upserts.push(newTask);

      const children = results.tasks.filter((t) => t.parentId === task.id);

      for (let i = 0; i < children.length; i++) {
        run(children[i], newTask.id, i + 1, false);
      }
    };

    let order = startOrder;
    const rootNodes = results.tasks
      .filter((x) => x.parentId == null)
      .sort((a, b) => sorter(a.order, b.order));

    for (const node of rootNodes) {
      run(node, dir === 'right' ? fromTask.id : fromTask.parentId, order, true);
      order++;
    }

    return forkJoin([
      this.entryService.generalSaveAsync(entry, version),
      this.taskService.saveAsync(upserts, []),
    ]).pipe(map(() => {}));
  }
}

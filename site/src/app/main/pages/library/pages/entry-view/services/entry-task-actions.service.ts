import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { LibraryEntryNode, ListItem } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { MetadataState } from '@wbs/main/states';
import { TasksChanged } from '../actions';
import { TaskCreationResults } from '@wbs/main/components/task-create/task-creation-results.model';

@Injectable()
export class EntryTaskActionsService {
  private readonly taskCreateService = inject(TaskCreateService);
  private readonly store = inject(Store);

  run(
    action: string,
    entryId: string,
    entryVersion: number,
    tasks: LibraryEntryNode[],
    taskId: string | undefined
  ): void {
    if (action === 'addSub') {
      this.taskCreateService.open(this.disciplines()).subscribe((results) => {
        if (!results?.model) return;

        this.createTask(entryId, entryVersion, results, tasks, taskId!);
      });
    }
  }

  private disciplines(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.disciplines);
  }

  private createTask(
    entryId: string,
    entryVersion: number,
    results: TaskCreationResults,
    tasks: LibraryEntryNode[],
    taskId: string
  ): void {
    const siblings = tasks.filter((x) => x.parentId === taskId);

    const order =
      siblings.length === 0
        ? 1
        : Math.max(
            ...tasks.filter((x) => x.parentId === taskId).map((x) => x.order)
          ) + 1;

    const task: LibraryEntryNode = {
      id: IdService.generate(),
      parentId: taskId,
      entryId,
      entryVersion,
      order,
      lastModified: new Date(),
      title: results.model.title!,
      description: results.model.description,
      disciplineIds: results.model.disciplineIds,
    };
    this.store.dispatch(new TasksChanged([task], []));
  }
}

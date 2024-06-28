import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './library-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule],
  providers: [],
})
export class LibraryImportComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly metadata = inject(MetadataStore);
  private readonly membership = inject(MembershipStore).membership;

  readonly spinIcon = faSpinner;
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  import(value: string): void {
    this.error.set(null);
    this.saving.set(true);

    try {
      let libraries = JSON.parse(value);
      //const categories = this.getCategories();
      //const disciplines = this.getDisciplines();
      const owner = this.membership()!.name;
      let memberIndex = 0;

      if (!Array.isArray(libraries)) libraries = [libraries];

      this.data.memberships
        .getMembershipUsersAsync(owner, false)
        .subscribe((members) => {
          for (const library of libraries) {
            const entry: LibraryEntry = {
              id: IdService.generate(),
              author: userId, // members[memberIndex].id,
              owner,
              type: library.type,
              visibility: 'public',
            };
            const version: LibraryEntryVersion = {
              entryId: entry.id,
              version: 1,
              categories: [], //[categories.get(library.category)!],
              disciplines: [],
              lastModified: new Date(),
              status: 'draft',
              title: library.name,
            };
            const tasks = new Map<
              string,
              { title: string; disciplines: string[] }
            >();

            for (const task of library.tasks) {
              tasks.set(task.level, task);
            }

            const getTasks: (
              parentLevel: number[],
              parentId: string | undefined
            ) => LibraryEntryNode[] = (parentLevel, parentId) => {
              const nodes: LibraryEntryNode[] = [];
              let level = 1;
              let levelText = [...parentLevel, level].join('.');

              while (tasks.has(levelText)) {
                const task = tasks.get(levelText)!;
                const child: LibraryEntryNode = {
                  id: IdService.generate(),
                  parentId,
                  title: task.title,
                  //disciplineIds: task.disciplines.map(
                  //  (discipline) => disciplines.get(discipline)!
                  //),
                  order: level,
                  lastModified: new Date(),
                };
                nodes.push(child);
                nodes.push(...getTasks([...parentLevel, level], child.id));

                level++;
                levelText = [...parentLevel, level].join('.');
              }

              return nodes;
            };

            const nodesToSave = getTasks([], undefined);
            /*const disciplineIds: string[] = [];

            for (const node of nodesToSave) {
              for (const discipline of node.disciplineIds!) {
                if (!disciplineIds.includes(discipline)) {
                  disciplineIds.push(discipline);
                }
              }
            }
            version.disciplines = disciplineIds.map((id) => ({
              id,
              isCustom: false,
            }));*/

            memberIndex++;
            if (memberIndex >= members.length) {
              memberIndex = 0;
            }
            this.data.libraryEntries
              .putAsync(entry)
              .pipe(
                switchMap(() =>
                  this.data.libraryEntryVersions.putAsync(owner, version)
                ),
                switchMap(() =>
                  this.data.libraryEntryNodes.putAsync(
                    owner,
                    entry.id,
                    1,
                    nodesToSave,
                    []
                  )
                ),
                catchError((error, caught) => {
                  this.error.set(`Error Message: ${error?.message}`);
                  console.error(error);

                  return caught;
                })
              )
              .subscribe(() => this.saving.set(false));
          }
        });
    } catch (e: any) {
      this.error.set(`Error Message: ${e?.message}`);
      console.error(e);
      this.saving.set(false);
    }
  }

  private getCategories(): Map<string, string> {
    const categories = new Map<string, string>();

    for (const category of this.metadata.categories.projectCategories) {
      categories.set(category.label, category.id);
    }
    return categories;
  }

  private getDisciplines(): Map<string, string> {
    const categories = new Map<string, string>();

    for (const category of this.metadata.categories.disciplines) {
      categories.set(category.label, category.id);
    }
    return categories;
  }
}

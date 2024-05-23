import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DisciplineSettingsPageComponent } from '@wbs/components/discipline-settings-page';
import { DirtyComponent, LibraryEntryVersion } from '@wbs/core/models';
import { CategoryService, SaveService } from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  template: `<wbs-discipline-settings-page
    [canAdd]="true"
    [saveService]="saveService"
    [(disciplines)]="disciplines"
    (saveClicked)="save()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineSettingsPageComponent],
})
export class DisciplinesComponent implements DirtyComponent {
  private readonly catService = inject(CategoryService);
  private readonly entryService = inject(EntryService);
  private readonly taskService = inject(EntryTaskService);
  readonly entryStore = inject(EntryStore);

  readonly saveService = new SaveService();
  readonly disciplines = signal<CategorySelection[]>([]);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  constructor() {
    effect(() => this.set(this.entryStore.version()), {
      allowSignalWrites: true,
    });
  }

  save(): void {
    const results = this.catService.extract(
      this.disciplines(),
      this.entryStore.version()?.disciplines ?? []
    );

    const obs = this.entryService
      .disciplinesChangedAsync(results.categories)
      .pipe(
        switchMap(() =>
          results.removedIds.length === 0
            ? of('hello')
            : this.taskService.removeDisciplinesFromAllTasksAsync(
                results.removedIds
              )
        )
      );
    this.saveService.call(obs).subscribe();
  }

  private set(version: LibraryEntryVersion | undefined): void {
    this.disciplines.set(
      this.catService.buildDisciplines(version?.disciplines ?? [])
    );
  }
}

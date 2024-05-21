import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DisciplineSettingsPageComponent } from '@wbs/components/discipline-settings-page';
import { DirtyComponent } from '@wbs/core/models';
import { CategoryService, SaveService } from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  template: `<wbs-discipline-settings-page
    [canAdd]="false"
    [saveService]="saveService"
    [(disciplines)]="disciplines"
    (saveClicked)="save()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineSettingsPageComponent],
})
export class DisciplinesComponent implements DirtyComponent {
  private readonly catService = inject(CategoryService);
  private readonly service = inject(EntryTaskService);
  readonly entryStore = inject(EntryStore);

  readonly taskId = input.required<string>();

  readonly saveService = new SaveService();
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  constructor() {
    effect(
      () =>
        this.disciplines.set(
          this.catService.buildDisciplinesFromList(
            this.entryStore.version()?.disciplines ?? [],
            this.entryStore
              .getTask(this.taskId)()
              ?.disciplines.map((x) => x.id) ?? [],
            true
          )
        ),
      { allowSignalWrites: true }
    );
  }

  save(): void {
    this.saveService
      .call(
        this.service.disciplinesChangedAsync(
          this.taskId(),
          this.disciplines()!
            .filter((x) => x.selected)
            .map((x) => x.id)
        )
      )
      .subscribe();
  }
}

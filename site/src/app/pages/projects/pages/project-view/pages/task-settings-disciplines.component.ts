import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { DisciplineSettingsPageComponent } from '@wbs/components/discipline-settings-page';
import { CategoryService, SaveService, SignalStore } from '@wbs/core/services';
import { DirtyComponent } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { ChangeTaskDisciplines } from '../actions';
import { ProjectState, TasksState } from '../states';

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
  private readonly store = inject(SignalStore);
  private readonly project = this.store.select(ProjectState.current);
  private readonly task = this.store.select(TasksState.current);

  readonly saveService = new SaveService();
  readonly disciplines = model<CategorySelection[]>([]);
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  constructor() {
    effect(
      () =>
        this.disciplines.set(
          this.catService.buildDisciplinesFromList(
            this.project()?.disciplines ?? [],
            this.task()?.disciplines?.map((x) => x.id) ?? []
          )
        ),
      { allowSignalWrites: true }
    );
  }

  save(): void {
    const results = this.disciplines()!
      .filter((x) => x.selected)
      .map((x) => x.id);

    this.saveService
      .call(this.store.dispatch(new ChangeTaskDisciplines(results)))
      .subscribe();
  }
}

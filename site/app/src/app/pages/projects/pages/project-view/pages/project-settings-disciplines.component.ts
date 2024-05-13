import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
} from '@angular/core';
import { DisciplineSettingsPageComponent } from '@wbs/components/discipline-settings-page';
import { DirtyComponent } from '@wbs/core/models';
import {
  CategorySelectionService,
  SaveService,
  SignalStore,
} from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { ChangeProjectDiscipines } from '../actions';
import { ProjectState } from '../states';

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
  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(SignalStore);
  private readonly project = this.store.select(ProjectState.current);

  readonly saveService = new SaveService();
  readonly disciplines = model<CategorySelection[]>();
  readonly isDirty = () => this.catService.isListDirty(this.disciplines());

  constructor() {
    effect(
      () =>
        this.disciplines.set(
          this.catService.buildDisciplines(this.project()?.disciplines ?? [])
        ),
      { allowSignalWrites: true }
    );
  }

  save(): void {
    const results = this.catService.extract(
      this.disciplines(),
      this.project()!.disciplines
    );

    this.saveService
      .call(this.store.dispatch(new ChangeProjectDiscipines(results)))
      .subscribe();
  }
}

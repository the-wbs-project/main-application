import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitleComponent } from '@wbs/components/import-from-library-dialog/components/tasks-view/components';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { TreeService } from '@wbs/core/services';
import { UiStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';
import { ImportTask } from '../../models';
import { TaskViewService } from './task-view.service';

@Component({
  standalone: true,
  selector: 'wbs-upload-task-view',
  templateUrl: './task-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskViewService],
  imports: [
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    TaskTitleComponent,
    TaskTitleEditorComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class TaskViewComponent {
  readonly service = inject(TaskViewService);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly tasks = model.required<ImportTask[]>();
  readonly disciplines = input.required<CategoryViewModel[]>();
  //
  //  Signals
  //
  readonly containerHeight = input.required<number>();
  readonly selected = model<ImportTask | undefined>(undefined);
  readonly width = inject(UiStore).mainContentWidth;
  //
  //  Computed
  //
  readonly pageSize = computed(() => {
    const height = this.containerHeight() - 50 - 48 - 36;
    const rows = Math.floor(height / 31.5);

    return Math.max(20, rows * 2);
  });

  updateDisciplines(item: ImportTask, disciplines: CategoryViewModel[]): void {
    item.disciplines = disciplines;

    const ids = disciplines.map((x) => x.id);

    item.resources = item.resources.filter(
      (p) => p.discipline && ids.includes(p.discipline)
    );
  }

  removeTask(task: ImportTask): void {
    this.service.removeTaskAsync(task).subscribe((ids) => {
      if (ids) {
        this.tasks.update((tasks) => [
          ...tasks.filter((x) => !ids.includes(x.id)),
        ]);
      }
    });
  }
}

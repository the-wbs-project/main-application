import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { faRefresh } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  RowReorderEvent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitleComponent } from '@wbs/components/import-from-library-dialog/components/tasks-view/components';
import { TaskDeleteConfirmDialogComponent } from '@wbs/components/task-delete-confirm-dialog';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { sorter, TreeService, WbsNodeService } from '@wbs/core/services';
import { UiStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';
import { ImportTask, MENU_ACTIONS } from '../../models';
import { TaskViewTitleComponent } from '../task-view-title';
import { TaskViewService } from './task-view.service';

@Component({
  standalone: true,
  selector: 'wbs-upload-task-view',
  templateUrl: './task-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskViewService],
  imports: [
    ButtonModule,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    TaskTitleComponent,
    TaskTitleEditorComponent,
    TaskViewTitleComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class TaskViewComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly wbsService = inject(WbsNodeService);

  readonly removeIcon = faTrash;
  readonly refreshIcon = faRefresh;
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
  //
  //  Output
  //
  readonly reloadTree = output<void>();

  ngOnInit(): void {
    this.treeService.expandedKeys = this.tasks().map((x) => x.id);
  }

  updateDisciplines(item: ImportTask, disciplines: CategoryViewModel[]): void {
    item.disciplines = disciplines;

    const ids = disciplines.map((x) => x.id);

    item.resources = item.resources.filter(
      (p) => p.discipline && ids.includes(p.discipline)
    );
  }

  menuItemSelected(taskId: string, action: string): void {
    this.tasks.update((tasks) => {
      let changed: ImportTask[] = [];

      if (action === MENU_ACTIONS.moveUp) {
        changed = this.wbsService.moveTaskUp(tasks, taskId);
      } else if (action === MENU_ACTIONS.moveDown) {
        changed = this.wbsService.moveTaskDown(tasks, taskId);
      } else if (action === MENU_ACTIONS.moveLeft) {
        changed = this.wbsService.moveTaskLeft(tasks, taskId);
      } else if (action === MENU_ACTIONS.moveRight) {
        changed = this.wbsService.moveTaskRight(tasks, taskId);
      }

      for (const item of changed) {
        const index = tasks.findIndex((x) => x.id === item.id);

        tasks.splice(index, 1, item);
      }

      return structuredClone(this.wbsService.rebuildLevels(tasks));
    });
  }

  rowReordered(e: RowReorderEvent): void {
    const dragged: ImportTask = e.draggedRows[0].dataItem;
    const target: ImportTask = e.dropTargetRow?.dataItem;

    this.tasks.update((tasks) => {
      if (e.dropPosition === 'over') {
        //
        //  Set the parent to the target and give this item the last position
        //
        const children = tasks.filter((x) => x.parentId === target.id);

        dragged.parentId = target.id;
        dragged.order = children.length === 0 ? 1 : children.length + 1;
      } else {
        const delta = e.dropPosition === 'before' ? -0.1 : 0.1;

        dragged.parentId = target.parentId;
        dragged.order = target.order + delta;
      }

      const index = tasks.findIndex((x) => x.id === dragged.id);

      tasks.splice(index, 1, dragged);

      return structuredClone(this.wbsService.rebuildLevels(tasks));
    });
  }

  removeHandler(task: ImportTask): void {
    TaskDeleteConfirmDialogComponent.launchAsync(
      this.dialogService,
      false
    ).subscribe((results) => {
      if (!results) return;

      this.tasks.update((tasks) => {
        const toDelete = [task.id];
        let order = 1;
        //
        //  Get all siblings to the task being deleted which have a higher order
        //
        const siblings = tasks
          .filter((x) => x.parentId === task.parentId && x.order > task.order)
          .sort((a, b) => sorter(a.order, b.order));

        if (results.deleteSubTasks) {
          toDelete.push(...task.childrenIds);
        } else {
          const children = tasks
            .filter((x) => x.parentId === task.id)
            .sort((a, b) => sorter(a.order, b.order));
          //
          //  Update children's parentId to be the task's parentId.
          //    Then change the order to include the children where the task was.
          //
          for (const child of children) {
            child.parentId = task.parentId;
            child.order = order;
            order++;
          }
        }
        //
        //  Now let's update the siblings' order
        //
        for (const sibling of siblings) {
          sibling.order = order;
          order++;
        }

        return this.wbsService.rebuildLevels(
          tasks.filter((x) => !toDelete.includes(x.id))
        );
      });
    });
  }
}

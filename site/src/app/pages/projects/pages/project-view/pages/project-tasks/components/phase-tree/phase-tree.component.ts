import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  ContextMenuComponent,
  ContextMenuModule,
} from '@progress/kendo-angular-menu';
import {
  CellClickEvent,
  ColumnComponent,
  RowReorderEvent,
  SelectableSettings,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { ContextMenuItemComponent } from '@wbs/components/_utils/context-menu-item.component';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { ProgressBarComponent } from '@wbs/components/_utils/progress-bar.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { AbsHeaderComponent } from '@wbs/components/abs-header';
import { AbsIconComponent } from '@wbs/components/abs-icon.component';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitle2Component } from '@wbs/components/task-title';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import {
  TreeButtonsAddComponent,
  TreeButtonsDownloadComponent,
  TreeButtonsTogglerComponent,
  TreeButtonsUploadComponent,
} from '@wbs/components/_utils/tree-buttons';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { Messages, SignalStore, TreeService, Utils } from '@wbs/core/services';
import {
  CategoryViewModel,
  ProjectViewModel,
  TaskViewModel,
} from '@wbs/core/view-models';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/pipes/find-them-by-id.pipe';
import { UiStore } from '@wbs/core/store';
import { Observable } from 'rxjs';
import {
  ChangeTaskBasics,
  ChangeTaskDisciplines,
  CreateTask,
  RebuildNodeViews,
  TreeReordered,
} from '../../../../actions';
import { ApprovalBadgeComponent } from '../../../../components/approval-badge.component';
import { ChildrenApprovalPipe } from '../../../../pipes/children-approval.pipe';
import {
  ProjectNavigationService,
  ProjectViewService,
} from '../../../../services';
import { ProjectApprovalState, TasksState } from '../../../../states';
import { PhaseTreeMenuService } from './phase-tree-menu.service';
import { PhaseTreeReorderService } from './phase-tree-reorder.service';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-project-phase-tree',
  templateUrl: './phase-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhaseTreeReorderService, PhaseTreeMenuService],
  imports: [
    AbsHeaderComponent,
    AbsIconComponent,
    AlertComponent,
    ApprovalBadgeComponent,
    ButtonModule,
    ChildrenApprovalPipe,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FindByIdPipe,
    FindThemByIdPipe,
    FontAwesomeModule,
    ProgressBarComponent,
    SaveMessageComponent,
    TaskTitle2Component,
    TaskTitleEditorComponent,
    TranslateModule,
    TreeButtonsAddComponent,
    TreeButtonsDownloadComponent,
    TreeButtonsTogglerComponent,
    TreeButtonsUploadComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class ProjectPhaseTreeComponent implements OnInit {
  private readonly actions$ = inject(Actions);
  private readonly menuService = inject(PhaseTreeMenuService);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(PhaseTreeReorderService);
  private readonly store = inject(SignalStore);
  readonly navigate = inject(ProjectNavigationService);
  readonly service = inject(ProjectViewService);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  readonly project = input.required<ProjectViewModel>();
  readonly projectUrl = input.required<string[]>();
  //
  //  components
  //
  readonly treeList = viewChild<TreeListComponent>(TreeListComponent);
  readonly gridContextMenu =
    viewChild<ContextMenuComponent>(ContextMenuComponent);
  readonly canEdit = computed(
    () =>
      this.project().status === PROJECT_STATI.PLANNING &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.TASKS.CREATE)
  );

  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  readonly checkIcon = faCheck;
  readonly plusIcon = faPlus;
  readonly infoIcon = faCircleQuestion;

  readonly width = inject(UiStore).mainContentWidth;
  readonly tasks = this.store.select(TasksState.phases);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly taskId = signal<string | undefined>(undefined);
  readonly alert = signal<string | undefined>(undefined);
  readonly task = computed(
    () => this.tasks()?.find((x) => x.id === this.taskId())!
  );
  readonly menu = computed(() =>
    this.menuService.buildMenu(this.project(), this.task(), this.claims())
  );

  ngOnInit(): void {
    this.store
      .selectAsync(TasksState.phases)
      .pipe(untilDestroyed(this))
      .subscribe((phases) => this.treeService.updateState(phases ?? []));

    this.actions$
      .pipe(ofActionSuccessful(CreateTask), untilDestroyed(this))
      .subscribe(() => {
        const phases = this.tasks() ?? [];
        const taskIndex = phases.findIndex((x) => x.id === this.taskId());
        if (!taskIndex) return;

        const task = phases[taskIndex];

        if (task) {
          this.treeList()?.expand(task);
          this.treeList()?.focusCell(taskIndex, 0);
        }
      });

    this.treeService.expandedKeys = [];
  }

  navigateToTask(): void {
    setTimeout(() => {
      this.store.dispatch(
        new Navigate([...this.projectUrl(), 'tasks', this.taskId()!])
      );
    }, 150);
  }

  onCellClick(e: CellClickEvent): void {
    this.taskId.set(e.dataItem.id);

    if (e.type === 'contextmenu') {
      const originalEvent = e.originalEvent;
      originalEvent.preventDefault();

      this.gridContextMenu()?.show({
        left: originalEvent.pageX,
        top: originalEvent.pageY,
      });
      return;
    }

    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = this.getViewModels();
    const dragged: TaskViewModel = e.draggedRows[0].dataItem;
    const target: TaskViewModel = e.dropTargetRow?.dataItem;
    const validation = this.reorderer.validate(dragged, target, e.dropPosition);

    if (!validation.valid) {
      this.alert.set(validation.errorMessage);
      this.resetTree();
      return;
    } else {
      this.alert.set(undefined);
    }
    const run = () => {
      const results = this.reorderer.run(tree, dragged, target, e.dropPosition);

      this.treeService.callSave(
        dragged.id,
        this.store.dispatch(new TreeReordered(dragged.id, results))
      );
    };
    if (validation.confirmMessage) {
      this.messages.confirm
        .show('General.Confirm', validation.confirmMessage)
        .subscribe((results) => {
          if (results) {
            run();
          } else {
            this.resetTree();
          }
        });
    } else {
      run();
    }
  }

  disciplinesChanged(
    treelist: TreeListComponent,
    taskId: string,
    discipilnes: CategoryViewModel[]
  ) {
    treelist.closeCell();
    this.treeService.callSave(
      taskId,
      this.store.dispatch(
        new ChangeTaskDisciplines(
          taskId,
          discipilnes.map((x) => x.id)
        )
      )
    );
  }

  taskTitleChanged(
    treelist: TreeListComponent,
    taskId: string,
    title: string
  ): void {
    treelist.closeCell();

    const task = this.tasks()?.find((x) => x.id === taskId);

    if (!task) return;

    this.treeService.callSave(
      taskId,
      this.store.dispatch(
        new ChangeTaskBasics(
          taskId,
          title,
          task.description ?? '',
          task.absFlag === 'set'
        )
      )
    );
  }

  addPhase(): void {
    const obsOrVoid = this.service.action('addSub');

    if (obsOrVoid instanceof Observable) {
      obsOrVoid.subscribe();
    }
  }

  menuItemSelected(item: string): void {
    const taskId = this.taskId()!;
    const obsOrVoid = this.service.action(item, taskId);

    if (obsOrVoid instanceof Observable) {
      this.treeService.callSave(taskId, obsOrVoid);
    }
  }

  private resetTree(): void {
    this.store.dispatch(new RebuildNodeViews());
  }

  private getViewModels(): TaskViewModel[] {
    return structuredClone(this.store.selectSnapshot(TasksState.phases) ?? []);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  CellClickEvent,
  ColumnComponent,
  RowReorderEvent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
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
  TreeButtonsFullscreenComponent,
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
import { PhaseTreeReorderService } from '../../services';
import { PhaseTaskTitleComponent } from '../phase-task-title';
import { TreeTypeButtonComponent } from '../tree-type-button';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-project-phase-tree',
  templateUrl: './phase-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhaseTreeReorderService],
  imports: [
    AbsHeaderComponent,
    AbsIconComponent,
    AlertComponent,
    ApprovalBadgeComponent,
    ButtonModule,
    ChildrenApprovalPipe,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FindByIdPipe,
    FindThemByIdPipe,
    FontAwesomeModule,
    PhaseTaskTitleComponent,
    ProgressBarComponent,
    RouterModule,
    SaveMessageComponent,
    TaskTitle2Component,
    TaskTitleEditorComponent,
    TranslateModule,
    TreeButtonsAddComponent,
    TreeButtonsDownloadComponent,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
    TreeButtonsUploadComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
    TreeTypeButtonComponent,
  ],
})
export class ProjectPhaseTreeComponent implements OnInit {
  private readonly actions$ = inject(Actions);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(PhaseTreeReorderService);
  private readonly store = inject(SignalStore);
  readonly width = inject(UiStore).mainContentWidth;
  readonly navigate = inject(ProjectNavigationService);
  readonly service = inject(ProjectViewService);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  readonly showFullscreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
  readonly currentProject = input.required<ProjectViewModel>();
  readonly view = model.required<'phases' | 'disciplines'>();
  //
  //  components
  //
  readonly treeList = viewChild<TreeListComponent>(TreeListComponent);
  //
  //  Constaints
  //
  readonly heightOffset = 50;
  readonly rowHeight = 31.5;
  readonly downloadMenuItems = [
    { id: 'downloadAbs', text: 'Wbs.ABS-Full2' },
    { id: 'downloadWbs', text: 'Wbs.WBS-Full2' },
  ];
  //
  //  signals/models
  //
  readonly tasks = this.store.select(TasksState.phases);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly taskId = signal<string | undefined>(undefined);
  readonly alert = signal<string | undefined>(undefined);
  //
  //  Computed signals
  //
  readonly task = computed(
    () => this.tasks()?.find((x) => x.id === this.taskId())!
  );
  readonly canEdit = computed(
    () =>
      this.currentProject().status === PROJECT_STATI.PLANNING &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.TASKS.CREATE)
  );
  readonly pageSize = computed(() =>
    this.treeService.pageSize(
      this.containerHeight(),
      this.heightOffset,
      this.rowHeight
    )
  );
  //
  //  Outputs
  //
  readonly navigateToTask = output<string>();
  readonly goFullScreen = output<void>();

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

    this.treeService.expandedKeys = (this.tasks() ?? [])
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  nav(): void {
    if (this.taskId()) this.navigateToTask.emit(this.taskId()!);
  }

  onCellClick(e: CellClickEvent): void {
    this.taskId.set(e.dataItem.id);

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
      //@ts-ignore
      obsOrVoid.subscribe();
    }
  }

  menuItemSelected(item: string, taskId?: string): void {
    const obsOrVoid = this.service.action(item, taskId);

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.treeService.callSave(taskId, obsOrVoid);
      else {
        //@ts-ignore
        obsOrVoid.subscribe();
      }
    }
  }

  private resetTree(): void {
    this.store.dispatch(new RebuildNodeViews());
  }

  private getViewModels(): TaskViewModel[] {
    return structuredClone(this.store.selectSnapshot(TasksState.phases) ?? []);
  }
}

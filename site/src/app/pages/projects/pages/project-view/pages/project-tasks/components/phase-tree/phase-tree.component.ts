import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
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
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  CellClickEvent,
  ColumnComponent,
  RowClassArgs,
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
  ProjectTaskViewModel,
  TaskViewModel,
} from '@wbs/core/view-models';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/pipes/find-them-by-id.pipe';
import { UiStore } from '@wbs/core/store';
import { Observable } from 'rxjs';
import { ApprovalBadgeComponent } from '../../../../components/approval-badge.component';
import { PhaseTaskTitleComponent } from '../../../../components/phase-task-title';
import { ChildrenApprovalPipe } from '../../../../pipes/children-approval.pipe';
import {
  ProjectNavigationService,
  ProjectTaskService,
  ProjectViewService,
} from '../../../../services';
import { ProjectApprovalState } from '../../../../states';
import { ProjectStore } from '../../../../stores';
import { PhaseTreeReorderService } from '../../services';
import { PhaseTreeTitleLegendComponent } from '../phase-tree-title-legend';
import { TreeTypeButtonComponent } from '../tree-type-button';

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
    PhaseTreeTitleLegendComponent,
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
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(PhaseTreeReorderService);
  private readonly taskService = inject(ProjectTaskService);
  private readonly store = inject(SignalStore);
  readonly width = inject(UiStore).mainContentWidth;
  readonly navigate = inject(ProjectNavigationService);
  readonly projectStore = inject(ProjectStore);
  readonly viewService = inject(ProjectViewService);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  readonly showFullscreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
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
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly taskId = signal<string | undefined>(undefined);
  readonly alert = signal<string | undefined>(undefined);
  //
  //  Computed signals
  //
  readonly task = computed(
    () => this.projectStore.viewModels()?.find((x) => x.id === this.taskId())!
  );
  readonly canEdit = computed(
    () =>
      this.projectStore.project()?.status === PROJECT_STATI.PLANNING &&
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

  constructor() {
    effect(() => {
      this.treeService.updateState(this.projectStore.viewModels() ?? []);
    });
  }

  ngOnInit(): void {
    /*this.actions$
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
      });*/

    this.treeService.expandedKeys = (this.projectStore.viewModels() ?? [])
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  onCellClick(e: CellClickEvent): void {
    this.taskId.set(e.dataItem.id);

    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = structuredClone(this.projectStore.viewModels() ?? []);
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

      this.taskService.treeReordered(dragged.id, results).subscribe();
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
    disciplines: CategoryViewModel[]
  ) {
    treelist.closeCell();
    this.treeService.callSave(
      taskId,
      this.taskService.changeDisciplines(taskId, disciplines)
    );
  }

  taskTitleChanged(
    treelist: TreeListComponent,
    taskId: string,
    title: string
  ): void {
    treelist.closeCell();

    const task = this.projectStore.viewModels()?.find((x) => x.id === taskId);

    if (!task) return;

    this.treeService.callSave(
      taskId,
      this.taskService.changeTaskTitle(taskId, title)
    );
  }

  addPhase(): void {
    const obsOrVoid = this.viewService.action('addSub');

    if (obsOrVoid instanceof Observable) {
      //@ts-ignore
      obsOrVoid.subscribe();
    }
  }

  menuItemSelected(item: string, taskId?: string): void {
    const obsOrVoid = this.viewService.action(item, taskId);

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.treeService.callSave(taskId, obsOrVoid);
      else {
        //@ts-ignore
        obsOrVoid.subscribe();
      }
    }
  }

  rowCallback = (context: RowClassArgs) => {
    const vm = context.dataItem as ProjectTaskViewModel;

    return { 'bg-light-blue-f': vm.absFlag != undefined };
  };

  private resetTree(): void {
    this.projectStore.setTasks(
      structuredClone(this.projectStore.tasks() ?? [])
    );
  }
}

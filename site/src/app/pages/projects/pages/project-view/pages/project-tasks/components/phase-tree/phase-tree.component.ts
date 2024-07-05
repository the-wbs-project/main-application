import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
import { TaskTitleComponent } from '@wbs/components/task-title';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import {
  TreeButtonsAddComponent,
  TreeButtonsDownloadComponent,
  TreeButtonsTogglerComponent,
  TreeButtonsUploadComponent,
} from '@wbs/components/_utils/tree-buttons';
import { PROJECT_CLAIMS, PROJECT_STATI, SaveState } from '@wbs/core/models';
import { Messages, SignalStore, TreeService, Utils } from '@wbs/core/services';
import { ProjectViewModel, WbsNodeView } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/pipes/find-them-by-id.pipe';
import { UiStore } from '@wbs/core/store';
import { Observable, delay, tap } from 'rxjs';
import {
  ChangeTaskBasics,
  CreateTask,
  RebuildNodeViews,
  TreeReordered,
} from '../../../../actions';
import { ApprovalBadgeComponent } from '../../../../components/approval-badge.component';
import { ChildrenApprovalPipe } from '../../../../pipes/children-approval.pipe';
import {
  ProjectNavigationService,
  ProjectService,
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
    AlertComponent,
    ApprovalBadgeComponent,
    ButtonModule,
    ChildrenApprovalPipe,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconListComponent,
    FindByIdPipe,
    FindThemByIdPipe,
    FontAwesomeModule,
    ProgressBarComponent,
    RouterModule,
    SaveMessageComponent,
    TaskTitleComponent,
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
  private readonly projectService = inject(ProjectService);
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

  readonly taskSaveStates: Map<string, WritableSignal<SaveState>> = new Map();
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
      .subscribe((phases) => {
        this.updateState(phases ?? []);
      });
    /*
    Is this needed?
    this.store
      .selectAsync(ProjectApprovalState.list)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.cd.detectChanges());*/

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

    this.treeService.expandedKeys = this.projectService.getPhaseIds(
      this.tasks() ?? []
    );
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
    } else {
      this.taskId.set(e.dataItem.id);
    }
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = this.getViewModels();
    const dragged: WbsNodeView = e.draggedRows[0].dataItem;
    const target: WbsNodeView = e.dropTargetRow?.dataItem;
    const validation = this.reorderer.validate(dragged, target, e.dropPosition);

    if (!validation.valid) {
      this.alert.set(validation.errorMessage);
      this.resetTree();
      return;
    } else {
      this.alert.set(undefined);
    }
    const run = () => {
      console.log('REORDER!');
      const results = this.reorderer.run(tree, dragged, target, e.dropPosition);
      this.callSave(
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

  taskTitleChanged(taskId: string, title: string): void {
    const task = this.tasks()?.find((x) => x.id === taskId);

    if (!task) return;

    this.setSaveState(taskId, 'saving');

    this.store
      .dispatch(new ChangeTaskBasics(taskId, title, task.description ?? ''))
      .pipe(
        tap(() => this.setSaveState(taskId, 'saved')),
        delay(5000)
      )
      .subscribe(() => this.setSaveState(taskId, 'ready'));
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
      this.callSave(taskId, obsOrVoid);
    }
  }

  private setSaveState(taskId: string, state: SaveState): void {
    this.taskSaveStates.get(taskId)?.set(state);
  }

  private updateState(tasks: WbsNodeView[]): void {
    for (const task of tasks ?? []) {
      if (!this.taskSaveStates.has(task.id)) {
        this.taskSaveStates.set(task.id, signal('ready'));
      }
    }
  }

  private resetTree(): void {
    this.store.dispatch(new RebuildNodeViews());
  }

  private callSave(taskId: string, obs: Observable<any>): void {
    this.setSaveState(taskId, 'saving');

    obs
      .pipe(
        tap(() => this.setSaveState(taskId, 'saved')),
        delay(5000)
      )
      .subscribe(() => this.setSaveState(taskId, 'ready'));
  }

  private getViewModels(): WbsNodeView[] {
    return structuredClone(this.store.selectSnapshot(TasksState.phases) ?? []);
  }
}

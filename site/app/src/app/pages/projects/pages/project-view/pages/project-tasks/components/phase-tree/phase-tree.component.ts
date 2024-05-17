import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful } from '@ngxs/store';
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
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { ContextMenuItemComponent } from '@wbs/components/_utils/context-menu-item.component';
import { ProgressBarComponent } from '@wbs/components/_utils/progress-bar.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { TaskTitleComponent } from '@wbs/components/task-title';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { TreeTogglerComponent } from '@wbs/components/_utils/tree-toggler.component';
import { PROJECT_CLAIMS, PROJECT_NODE_VIEW, SaveState } from '@wbs/core/models';
import {
  Messages,
  SignalStore,
  TreeService,
  WbsPhaseService,
} from '@wbs/core/services';
import { ProjectViewModel, WbsNodeView } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/pipes/find-them-by-id.pipe';
import { UiStore } from '@wbs/core/store';
import { Observable, delay, of, switchMap, tap } from 'rxjs';
import {
  ChangeTaskBasics,
  CreateTask,
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

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-project-phase-tree',
  templateUrl: './phase-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhaseTreeMenuService, WbsPhaseService],
  imports: [
    AlertComponent,
    ApprovalBadgeComponent,
    CheckPipe,
    ChildrenApprovalPipe,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconListComponent,
    FindByIdPipe,
    FindThemByIdPipe,
    ProgressBarComponent,
    SaveMessageComponent,
    TaskTitleComponent,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
    TreeTogglerComponent,
  ],
})
export class ProjectPhaseTreeComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly actions$ = inject(Actions);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly menuService = inject(PhaseTreeMenuService);
  private readonly messages = inject(Messages);
  private readonly store = inject(SignalStore);
  private readonly wbsService = inject(WbsPhaseService);
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

  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  readonly checkIcon = faCheck;
  readonly canEditClaim = PROJECT_CLAIMS.TASKS.UPDATE;

  readonly taskSaveStates: Map<string, WritableSignal<SaveState>> = new Map();
  readonly tree = signal<WbsNodeView[] | undefined>(undefined);
  readonly width = inject(UiStore).mainContentWidth;
  readonly tasks = this.store.select(TasksState.phases);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly taskId = signal<string | undefined>(undefined);
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
        this.tree.set(structuredClone(phases));
        this.updateState(phases ?? []);
      });
    this.store
      .selectAsync(ProjectApprovalState.list)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.cd.detectChanges());

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

  onRowReordered(e: RowReorderEvent) {
    const nodes = JSON.parse(
      JSON.stringify(this.store.selectSnapshot(TasksState.phases)!)
    );

    if (e.dropPosition === 'forbidden') {
      this.messages.notify.error('You cannot drop a node under itself', false);
      this.tree.set(nodes);
      return;
    }

    const dragged: WbsNodeView = e.draggedRows[0].dataItem;
    const target: WbsNodeView = e.dropTargetRow?.dataItem;

    if (dragged.id === dragged.phaseId) {
      this.messages.notify.error(
        'You cannot move a phase from this screen.',
        false
      );
      this.tree.set(nodes);
      return;
    }
    const results = this.wbsService.reorder(
      nodes,
      dragged,
      target,
      e.dropPosition
    );

    this.store.dispatch(
      new TreeReordered(dragged.id, PROJECT_NODE_VIEW.PHASE, results)
    );
  }

  taskTitleChanged(taskId: string, title: string): void {
    const task = this.tree()?.find((x) => x.id === taskId);

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

  menuItemSelected(item: string): void {
    const taskId = this.taskId()!;
    const obsOrVoid = this.service.action(item, taskId);

    if (obsOrVoid instanceof Observable) {
      this.setSaveState(taskId, 'saving');

      obsOrVoid
        .pipe(
          switchMap((results) => {
            let obs = of('hello');
            if (results)
              obs = obs.pipe(
                delay(500),
                tap(() => this.setSaveState(taskId, 'saved')),
                delay(5000),
                tap(() => this.setSaveState(taskId, 'ready'))
              );

            return obs;
          })
        )
        .subscribe();
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
}

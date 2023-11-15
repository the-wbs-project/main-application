import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import {
  RowReorderEvent,
  SelectableSettings,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { PROJECT_CLAIMS, PROJECT_NODE_VIEW, Project } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { ProgressBarComponent } from '@wbs/main/components/progress-bar.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend/tree-discipline-legend.component';
import { WbsActionButtonsComponent } from '@wbs/main/components/wbs-action-buttons';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { WbsPhaseService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/main/pipes/find-them-by-id.pipe';
import { TreeReordered } from '../../../../../actions';
import { ApprovalBadgeComponent } from '../../../../../components/approval-badge.component';
import { ChildrenApprovalPipe } from '../../../../../pipes/children-approval.pipe';
import { TaskMenuPipe } from '../../../../../pipes/task-menu.pipe';
import {
  ProjectNavigationService,
  ProjectViewService,
} from '../../../../../services';
import {
  ProjectApprovalState,
  ProjectState,
  TasksState,
} from '../../../../../states';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-project-phase-tree',
  templateUrl: './phase-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WbsPhaseService],
  imports: [
    ApprovalBadgeComponent,
    CheckPipe,
    ChildrenApprovalPipe,
    DisciplineIconListComponent,
    FillElementDirective,
    FindByIdPipe,
    FindThemByIdPipe,
    ProgressBarComponent,
    TaskMenuPipe,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
    WbsActionButtonsComponent,
  ],
})
export class ProjectPhaseTreeComponent implements OnInit {
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) project?: Project;

  taskId?: string;
  expandedKeys: string[] = [];
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  readonly canEditClaim = PROJECT_CLAIMS.TASKS.UPDATE;

  readonly tree = signal<WbsNodeView[] | undefined>(undefined);
  readonly width = toSignal(this.store.select(UiState.mainContentWidth));
  readonly phases = toSignal(this.store.select(TasksState.phases));
  readonly approvals = toSignal(this.store.select(ProjectApprovalState.list));

  constructor(
    readonly navigate: ProjectNavigationService,
    readonly service: ProjectViewService,
    private readonly cd: ChangeDetectorRef,
    private readonly messages: Messages,
    private readonly store: Store,
    private readonly wbsService: WbsPhaseService
  ) {}

  ngOnInit(): void {
    this.store
      .select(TasksState.phases)
      .pipe(untilDestroyed(this))
      .subscribe((phases) => {
        this.tree.set(structuredClone(phases));
      });
    this.store
      .select(ProjectApprovalState.list)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        console.error('update');
        this.cd.detectChanges();
      });

    this.expandedKeys = this.store.selectSnapshot(ProjectState.phaseIds) ?? [];
  }

  rowReordered(e: RowReorderEvent) {
    const nodes = JSON.parse(JSON.stringify(this.getNodesSnapshot()));

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
    console.log(dragged);
    console.log(target);

    const results = this.wbsService.reorder(
      nodes,
      dragged,
      target,
      e.dropPosition
    );

    console.log(dragged);
    console.log(target);
    console.log(results);
    //this.zone.run(() => this.tree.set(results.rows));

    this.store.dispatch(
      new TreeReordered(dragged.id, PROJECT_NODE_VIEW.PHASE, results.rows)
    );
    //this.service.reordered([dragged.id, results.rows]);*/
  }

  private getNodesSnapshot(): WbsNodeView[] {
    return this.store.selectSnapshot(TasksState.phases)!;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Actions } from '@ngxs/store';
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
import {
  LIBRARY_CLAIMS,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { ProgressBarComponent } from '@wbs/main/components/progress-bar.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/pages/projects/pages/project-view/components/tree-discipline-legend/tree-discipline-legend.component';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/main/pipes/find-them-by-id.pipe';
import { Transformers, WbsPhaseService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import { EntryTreeMenuService } from '../../../../../services';
import { EntryTaskActionsService } from '../../../../../services/entry-task-actions.service';

@Component({
  standalone: true,
  selector: 'wbs-library-tree',
  templateUrl: './library-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EntryTaskActionsService, EntryTreeMenuService, WbsPhaseService],
  imports: [
    CheckPipe,
    ContextMenuModule,
    DisciplineIconListComponent,
    FindByIdPipe,
    FindThemByIdPipe,
    FontAwesomeModule,
    ProgressBarComponent,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class LibraryTreeComponent implements OnInit, OnChanges {
  private readonly menuService = inject(EntryTreeMenuService);
  private readonly store = inject(SignalStore);
  private readonly transformer = inject(Transformers);
  private readonly actions = inject(EntryTaskActionsService);

  @ViewChild(ContextMenuComponent) gridContextMenu!: ContextMenuComponent;
  @ViewChild(TreeListComponent) treeList!: TreeListComponent;

  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly claims = input.required<string[]>();
  readonly tasks = input.required<LibraryEntryNode[]>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = this.store.select(UiState.mainContentWidth);

  readonly tree = signal<WbsNodeView[] | undefined>(undefined);
  readonly taskId = signal<string | undefined>(undefined);
  readonly menu = computed(() =>
    this.menuService.buildMenu(this.tree()!, this.claims(), this.taskId())
  );

  expandedKeys: string[] = [];
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  constructor(
    private readonly actions$: Actions,
    private readonly messages: Messages,
    private readonly wbsService: WbsPhaseService
  ) {}

  ngOnInit(): void {
    /*    this.store
      .select(TasksState.phases)
      .pipe(untilDestroyed(this))
      .subscribe((phases) => {
        this.tree.set(structuredClone(phases));
      });*/
    /*
    this.actions$
      .pipe(ofActionSuccessful(CreateTask), untilDestroyed(this))
      .subscribe(() => {
        const phases = this.phases() ?? [];
        const taskIndex = phases.findIndex((x) => x.id === this.taskId());
        if (!taskIndex) return;

        const task = phases[taskIndex];

        if (task) {
          this.treeList.expand(task);
          this.treeList.focusCell(taskIndex, 0);
        }
      });*/
    //this.expandedKeys = this.store.selectSnapshot(ProjectState.phaseIds) ?? [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.tree.set(
        this.transformer.nodes.phase.view.run(
          this.version()!.phases,
          this.tasks()
        )
      );
    }
  }

  onAction(action: string): void {
    const version = this.version()!;

    this.actions.run(
      action,
      version.entryId,
      version.version,
      this.tasks(),
      this.taskId()
    );
  }

  onCellClick(e: CellClickEvent): void {
    this.taskId.set(e.dataItem.id);

    if (e.type === 'contextmenu') {
      const originalEvent = e.originalEvent;
      originalEvent.preventDefault();

      this.gridContextMenu.show({
        left: originalEvent.pageX,
        top: originalEvent.pageY,
      });
    } else {
      this.taskId.set(e.dataItem.id);
    }
  }

  onRowReordered(e: RowReorderEvent): void {
    /*const nodes = JSON.parse(
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
    );*/
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  ContextMenuComponent,
  ContextMenuModule,
} from '@progress/kendo-angular-menu';
import {
  CellClickEvent,
  RowReorderEvent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import {
  LIBRARY_CLAIMS,
  LIBRARY_ENTRY_TYPES,
  LibraryEntry,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { WbsPhaseService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import {
  EntryTaskActionService,
  EntryTaskRecorderService,
  EntryTreeMenuService,
} from '../../services';
import { EntryViewState } from '../../states';
import { TaskCreateComponent } from '@wbs/main/components/task-create';
import { TaskCreationResults } from '@wbs/main/models';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-library-tree',
  templateUrl: './library-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EntryTreeMenuService, WbsPhaseService],
  imports: [
    ButtonModule,
    CheckPipe,
    ContextMenuModule,
    DisciplineIconListComponent,
    FontAwesomeModule,
    TranslateModule,
    TaskCreateComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class LibraryTreeComponent implements OnInit {
  @ViewChild(TreeListComponent) treeList!: TreeListComponent;

  protected readonly createModal =
    viewChild<TaskCreateComponent>(TaskCreateComponent);
  protected readonly gridContextMenu =
    viewChild<ContextMenuComponent>(ContextMenuComponent);

  private readonly actions = inject(EntryTaskActionService);
  private readonly menuService = inject(EntryTreeMenuService);
  private readonly store = inject(SignalStore);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(EntryTaskRecorderService);

  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = this.store.select(UiState.mainContentWidth);

  readonly tree = signal<WbsNodeView[]>([]);
  readonly selectedTask = signal<WbsNodeView | undefined>(undefined);
  readonly menu = computed(() =>
    this.menuService.buildMenu(
      this.tree()!,
      this.claims(),
      this.selectedTask()?.id
    )
  );
  readonly phases = computed(() =>
    this.entry().type === LIBRARY_ENTRY_TYPES.TASK
      ? undefined
      : this.version()!.phases
  );
  readonly faChevronsLeft = faChevronsLeft;
  readonly faChevronsRight = faChevronsRight;

  expandedKeys: string[] = [];

  ngOnInit(): void {
    this.store
      .selectAsync(EntryViewState.taskVms)
      .pipe(untilDestroyed(this))
      .subscribe((tasks) => this.setTree(tasks));

    this.actions.expandedKeysChanged
      .pipe(untilDestroyed(this))
      .subscribe((keys) => this.setKeys(keys));
  }

  expandAll(): void {
    for (const node of this.tree()!) {
      if (node.subTasks.length > 0 && !this.expandedKeys.includes(node.id)) {
        this.treeList.expand(node);
      }
    }
  }

  collapseAll(): void {
    for (const node of this.tree()!) {
      if (this.expandedKeys.includes(node.id)) {
        this.treeList.collapse(node);
      }
    }
  }

  createTask(data: TaskCreationResults | undefined): void {
    if (!data) return;
    this.actions.createTask(data, this.selectedTask()!.id, this.expandedKeys);
  }

  onAction(action: string): void {
    if (action === 'addSub') {
      this.createModal()!.show();
    } else {
      this.actions.onAction(
        action,
        this.selectedTask()!.id,
        this.expandedKeys,
        this.tree()
      );
    }
  }

  onCellClick(e: CellClickEvent): void {
    this.selectedTask.set(e.dataItem);

    if (e.type === 'contextmenu') {
      const originalEvent = e.originalEvent;
      originalEvent.preventDefault();

      this.gridContextMenu()?.show({
        left: originalEvent.pageX,
        top: originalEvent.pageY,
      });
    }
  }

  expand(taskId: string): void {
    const keys = structuredClone(this.expandedKeys);

    if (!keys.includes(taskId)) {
      keys.push(taskId);
    }
    this.setKeys(keys);
  }

  collapse(taskId: string): void {
    const keys = structuredClone(this.expandedKeys);
    const index = keys.indexOf(taskId);

    if (index > -1) {
      keys.splice(index, 1);
    }
    this.setKeys(keys);
  }

  onRowReordered(e: RowReorderEvent): void {
    console.log('REORDER');
    //const tasks = structuredClone(this.tasks()!);
    const tree = this.tree()!;

    if (e.dropPosition === 'forbidden') {
      this.messages.notify.error('You cannot drop a node under itself', false);
      return;
    }

    const dragged: WbsNodeView = e.draggedRows[0].dataItem;
    const target: WbsNodeView = e.dropTargetRow?.dataItem;

    if (dragged.id === dragged.phaseId) {
      this.messages.notify.error(
        'You cannot move a phase from this screen.',
        false
      );
      this.setTree();
      return;
    }
    const results = this.reorderer.runForPhase(
      this.store.selectSnapshot(EntryViewState.tasks)!,
      tree,
      dragged,
      target,
      e.dropPosition
    );
    console.log(results);
    //this.taskService.reordered(results);
  }

  navigateToTask(taskId: string | undefined): void {
    if (!taskId) return;

    this.store.dispatch(new Navigate([...this.entryUrl(), 'tasks', taskId]));
  }

  private setTree(
    tree: WbsNodeView[] | undefined = this.store.selectSnapshot(
      EntryViewState.taskVms
    )
  ): void {
    this.tree.set(tree ?? []);
  }

  private setKeys(keys: string[]): void {
    this.expandedKeys = keys;
    this.setTree(this.tree());
    // this.cd.detectChanges();
  }
}

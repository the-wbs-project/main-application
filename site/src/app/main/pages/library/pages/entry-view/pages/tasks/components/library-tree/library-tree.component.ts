import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
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
import {
  LIBRARY_CLAIMS,
  LIBRARY_ENTRY_TYPES,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { ProgressBarComponent } from '@wbs/main/components/progress-bar.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/main/pipes/find-them-by-id.pipe';
import { Transformers, WbsPhaseService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import {
  EntryTaskActionService,
  EntryTaskRecorderService,
  EntryTreeMenuService,
} from '../../../../services';
import { EntryViewState } from '../../../../states';
import { Navigate } from '@ngxs/router-plugin';

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
    FindByIdPipe,
    FindThemByIdPipe,
    FontAwesomeModule,
    ProgressBarComponent,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
    JsonPipe,
  ],
})
export class LibraryTreeComponent implements OnInit {
  @ViewChild(ContextMenuComponent) gridContextMenu!: ContextMenuComponent;
  @ViewChild(TreeListComponent) treeList!: TreeListComponent;

  private readonly actions = inject(EntryTaskActionService);
  private readonly menuService = inject(EntryTreeMenuService);
  private readonly store = inject(SignalStore);
  private readonly transformer = inject(Transformers);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(EntryTaskRecorderService);

  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly claims = input.required<string[]>();
  //readonly tasks = input.required<LibraryEntryNode[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = this.store.select(UiState.mainContentWidth);

  readonly tasks = signal<LibraryEntryNode[] | undefined>(undefined);
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
  readonly tree = computed(() =>
    this.transformer.nodes.phase.view.run(this.tasks() ?? [], this.phases())
  );
  readonly faChevronsLeft = faChevronsLeft;
  readonly faChevronsRight = faChevronsRight;

  expandedKeys = signal<string[]>([]);
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  ngOnInit(): void {
    this.store
      .selectAsync(EntryViewState.tasks)
      .pipe(untilDestroyed(this))
      .subscribe((tasks) => this.tasks.set(tasks));

    this.actions.expandedKeysChanged
      .pipe(untilDestroyed(this))
      .subscribe((keys) => this.expandedKeys.set(keys));
  }

  collapseAll(): void {
    this.expandedKeys.set([]);
  }

  expandAll(): void {
    const ids: string[] = [];

    for (const task of this.tasks() ?? []) {
      if (task.parentId && !ids.includes(task.parentId)) {
        ids.push(task.parentId);
      }
    }
    this.expandedKeys.set(ids);
  }

  onAction(action: string): void {
    this.actions.onAction(
      action,
      this.selectedTask()!.id,
      this.expandedKeys(),
      this.tree()
    );
  }

  onCellClick(e: CellClickEvent): void {
    this.selectedTask.set(e.dataItem);

    if (e.type === 'contextmenu') {
      const originalEvent = e.originalEvent;
      originalEvent.preventDefault();

      this.gridContextMenu.show({
        left: originalEvent.pageX,
        top: originalEvent.pageY,
      });
    }
  }

  expand(taskId: string): void {
    const keys = this.expandedKeys();

    if (!keys.includes(taskId)) {
      keys.push(taskId);
    }
    this.expandedKeys.set(keys);
  }

  collapse(taskId: string): void {
    const keys = this.expandedKeys();
    const index = keys.indexOf(taskId);

    if (index > -1) {
      keys.splice(index, 1);
    }
    this.expandedKeys.set(keys);
  }

  onRowReordered(e: RowReorderEvent): void {
    const tasks = structuredClone(this.tasks()!);
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
      this.tasks.set(tasks);
      return;
    }
    const results = this.reorderer.runForPhase(
      tasks,
      tree,
      dragged,
      target,
      e.dropPosition
    );
    //this.taskService.reordered(results);
  }

  navigateToTask(taskId: string): void {
    const entry = this.entry()!;
    const version = this.version()!;

    this.store.dispatch(
      new Navigate([
        entry.owner,
        'library',
        'view',
        entry.id,
        version.version,
        'tasks',
        taskId,
      ])
    );
  }
}

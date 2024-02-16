import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
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
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { ProgressBarComponent } from '@wbs/main/components/progress-bar.component';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { FindThemByIdPipe } from '@wbs/main/pipes/find-them-by-id.pipe';
import { Transformers, WbsPhaseService } from '@wbs/main/services';
import { MetadataState, UiState } from '@wbs/main/states';
import { Observable, of, switchMap, tap } from 'rxjs';
import {
  EntryTaskRecorderService,
  EntryTaskService,
  EntryTreeMenuService,
} from '../../../../../services';
import { EntryViewState } from '../../../../../states';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  faChevronsLeft,
  faChevronsRight,
  faExpand,
} from '@fortawesome/pro-solid-svg-icons';

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

  private readonly cd = inject(ChangeDetectorRef);
  private readonly menuService = inject(EntryTreeMenuService);
  private readonly store = inject(SignalStore);
  private readonly transformer = inject(Transformers);
  private readonly messages = inject(Messages);
  private readonly taskService = inject(EntryTaskService);
  private readonly taskCreateService = inject(TaskCreateService);
  private readonly reorderer = inject(EntryTaskRecorderService);

  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly claims = input.required<string[]>();
  //readonly tasks = input.required<LibraryEntryNode[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = this.store.select(UiState.mainContentWidth);

  readonly tasks = signal<LibraryEntryNode[] | undefined>(undefined);
  readonly taskId = signal<string | undefined>(undefined);
  readonly menu = computed(() =>
    this.menuService.buildMenu(this.tree()!, this.claims(), this.taskId())
  );
  readonly tree = computed(() =>
    this.transformer.nodes.phase.view.run(
      this.version()!.phases,
      this.tasks() ?? []
    )
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
    /* ;*/
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
    const entry = this.entry();
    const version = this.version()!;
    const tasks = this.tasks()!;
    const taskId = this.taskId();
    const tree = this.tree();
    let obs: Observable<any> | undefined;

    if (action === 'addSub') {
      const disciplines = this.store.selectSnapshot(MetadataState.disciplines);

      obs = this.taskCreateService.open(disciplines).pipe(
        switchMap((results) =>
          !results?.model
            ? of()
            : this.taskService.createTask(
                entry.owner,
                entry.id,
                version.version,
                taskId!,
                results,
                tasks
              )
        ),
        tap(() => {
          const keys = structuredClone(this.expandedKeys());
          if (!keys.includes(taskId!)) {
            keys.push(taskId!);
          }
          this.expandedKeys.set(keys);
        })
      );
    } else if (action === 'moveLeft') {
      obs = this.taskService.moveTaskLeft(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'moveUp') {
      obs = this.taskService.moveTaskUp(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'moveRight') {
      obs = this.taskService.moveTaskRight(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'moveDown') {
      obs = this.taskService.moveTaskDown(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'deleteTask') {
      obs = this.taskService.removeTask(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks
      );
    } else if (action === 'cloneTask') {
      obs = this.taskService.cloneTask(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    }
    if (obs) obs.subscribe();
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
      this.tasks.set(tasks);
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
}

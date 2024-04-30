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
import { toObservable } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
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
import { SaveMessageComponent } from '@wbs/components/save-message.component';
import {
  LIBRARY_CLAIMS,
  LibraryEntry,
  LibraryEntryVersion,
  SaveState,
} from '@wbs/core/models';
import { EntryTaskService, Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { ContextMenuItemComponent } from '@wbs/main/components/context-menu-item.component';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { TaskCreateComponent } from '@wbs/main/components/task-create';
import { TaskTitleComponent } from '@wbs/main/components/task-title';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { TreeTogglerComponent } from '@wbs/main/components/tree-toggler.component';
import { TaskCreationResults } from '@wbs/main/models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { TreeService, WbsPhaseService } from '@wbs/main/services';
import { EntryStore, UiStore } from '@wbs/store';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  EntryTaskActionService,
  EntryTaskRecorderService,
  EntryTreeMenuService,
} from '../../services';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-library-tree',
  templateUrl: './library-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EntryTreeMenuService, WbsPhaseService],
  imports: [
    AlertComponent,
    ButtonModule,
    CheckPipe,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconListComponent,
    FontAwesomeModule,
    SaveMessageComponent,
    TranslateModule,
    TaskCreateComponent,
    TaskTitleComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
    TreeTogglerComponent,
  ],
})
export class LibraryTreeComponent implements OnInit {
  protected readonly treeList = viewChild<TreeListComponent>(TreeListComponent);
  protected readonly createModal =
    viewChild<TaskCreateComponent>(TaskCreateComponent);
  protected readonly gridContextMenu =
    viewChild<ContextMenuComponent>(ContextMenuComponent);

  private readonly actions = inject(EntryTaskActionService);
  private readonly menuService = inject(EntryTreeMenuService);
  private readonly store = inject(SignalStore);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(EntryTaskRecorderService);
  private readonly taskService = inject(EntryTaskService);
  readonly entryStore = inject(EntryStore);
  readonly treeService = new TreeService();

  readonly checkIcon = faCheck;
  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = inject(UiStore).mainContentWidth;

  readonly alert = signal<string | undefined>(undefined);
  readonly selectedTask = signal<WbsNodeView | undefined>(undefined);
  readonly taskSaveStates: Map<string, WritableSignal<SaveState>> = new Map();
  readonly menu = computed(() =>
    this.menuService.buildMenu(
      this.entry().type,
      this.version(),
      this.selectedTask(),
      this.claims()
    )
  );

  constructor() {
    toObservable(this.entryStore.viewModels)
      .pipe(untilDestroyed(this))
      .subscribe((tasks) => this.updateState(tasks ?? []));
  }

  ngOnInit(): void {
    this.actions.expandedKeysChanged
      .pipe(untilDestroyed(this))
      .subscribe((keys) => {
        this.treeService.expandedKeys = keys;
        this.resetTree();
      });
  }

  createTask(data: TaskCreationResults | undefined): void {
    if (!data) return;
    this.actions.createTask(
      data,
      this.selectedTask()!.id,
      this.entryUrl(),
      this.treeService.expandedKeys
    );
  }

  onAction(action: string): void {
    const taskId = this.selectedTask()!.id;
    if (action === 'addSub') {
      this.createModal()!.show();
    } else {
      const obsOrVoid = this.actions.onAction(action, this.entryUrl(), taskId);

      if (obsOrVoid instanceof Observable) {
        this.setSaveState(taskId, 'saving');
        obsOrVoid
          .pipe(
            tap(() => this.setSaveState(taskId, 'saved')),
            delay(5000)
          )
          .subscribe(() => this.setSaveState(taskId, 'ready'));
      }
    }
  }

  cellClick(e: CellClickEvent): void {
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
    this.treeService.expand(taskId);
    this.resetTree();
  }

  collapse(taskId: string): void {
    this.treeService.collapse(taskId);
    this.resetTree();
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = this.entryStore.viewModels()!;
    const entryType = this.entry().type;
    const dragged: WbsNodeView = e.draggedRows[0].dataItem;
    const target: WbsNodeView = e.dropTargetRow?.dataItem;
    const validation = this.reorderer.validate(
      entryType,
      dragged,
      target,
      e.dropPosition
    );

    if (!validation.valid) {
      this.alert.set(validation.errorMessage);
      this.resetTree();
      return;
    } else {
      this.alert.set(undefined);
    }
    const run = () => {
      const results = this.reorderer.run(
        this.entryStore.tasks()!,
        tree,
        dragged,
        target,
        e.dropPosition
      );
      this.taskService
        .saveAsync(results, [], 'Library.TasksReordered')
        .subscribe();
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

  navigateToTask(taskId: string | undefined): void {
    //
    //  Keep this here in case someone double clicks outside a standard row
    //
    if (!taskId) return;

    this.store.dispatch(new Navigate([...this.entryUrl(), 'tasks', taskId]));
  }

  taskTitleChanged(taskId: string, title: string): void {
    this.setSaveState(taskId, 'saving');

    this.taskService
      .titleChangedAsync(taskId, title)
      .pipe(
        tap(() => this.setSaveState(taskId, 'saved')),
        delay(5000)
      )
      .subscribe(() => this.setSaveState(taskId, 'ready'));
  }

  private resetTree(): void {
    this.entryStore.setTasks(structuredClone(this.entryStore.tasks() ?? []));
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

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
  LibraryEntry,
  LibraryEntryVersion,
  SaveState,
} from '@wbs/core/models';
import { Messages, SignalStore } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { TaskCreateComponent } from '@wbs/main/components/task-create';
import { TaskTitleComponent } from '@wbs/main/components/task-title';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { TreeTogglerComponent } from '@wbs/main/components/tree-toggler.component';
import { TaskCreationResults } from '@wbs/main/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { TreeService, WbsPhaseService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import {
  EntryState,
  EntryTaskActionService,
  EntryTaskRecorderService,
  EntryTaskService,
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
    ContextMenuModule,
    DisciplineIconListComponent,
    FontAwesomeModule,
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
  readonly state = inject(EntryState);
  readonly treeService = new TreeService();

  readonly canEditClaim = LIBRARY_CLAIMS.TASKS.UPDATE;

  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = this.store.select(UiState.mainContentWidth);

  readonly taskSaveStates = signal<Map<string, SaveState>>(new Map());
  readonly alert = signal<string | undefined>(undefined);
  readonly selectedTask = signal<WbsNodeView | undefined>(undefined);
  readonly menu = computed(() =>
    this.menuService.buildMenu(
      this.entry().type,
      this.version(),
      this.selectedTask(),
      this.claims()
    )
  );

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
    if (action === 'addSub') {
      this.createModal()!.show();
    } else {
      this.actions.onAction(action, this.entryUrl(), this.selectedTask()!.id);
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
    const tree = this.state.viewModels()!;
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
        this.state.tasks()!,
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
    this.taskService.titleChangedAsync(taskId, title).subscribe();
  }

  private resetTree(): void {
    this.state.setTasks(structuredClone(this.state.tasks() ?? []));
  }
}

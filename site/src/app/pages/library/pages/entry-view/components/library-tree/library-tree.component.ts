import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faLock } from '@fortawesome/pro-solid-svg-icons';
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
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ContextMenuItemComponent } from '@wbs/components/_utils/context-menu-item.component';
import {
  TreeButtonsAddComponent,
  TreeButtonsDownloadComponent,
  TreeButtonsTogglerComponent,
  TreeButtonsUploadComponent,
} from '@wbs/components/_utils/tree-buttons';
import { TaskTitleComponent } from '@wbs/components/task-title';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import {
  LIBRARY_CLAIMS,
  LibraryEntry,
  LibraryEntryVersion,
  SaveState,
} from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  SignalStore,
  TreeService,
  Utils,
  WbsPhaseService,
} from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore, UiStore } from '@wbs/core/store';
import { TaskViewModel } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  EntryTaskActionService,
  EntryTaskReorderService,
} from '../../services';
import { LibraryTreeMenuService } from './library-tree-menu.service';
import { TreeFlagColumnHeaderComponent } from '../tree-flag-column-header';
import { VisibilityIconComponent } from '../visibility-icon.component';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-library-tree',
  templateUrl: './library-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LibraryTreeMenuService, WbsPhaseService],
  imports: [
    AlertComponent,
    ButtonModule,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconListComponent,
    FontAwesomeModule,
    RouterModule,
    SaveMessageComponent,
    TranslateModule,
    TaskTitleComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
    TreeButtonsAddComponent,
    TreeButtonsDownloadComponent,
    TreeButtonsTogglerComponent,
    TreeButtonsUploadComponent,
    TreeFlagColumnHeaderComponent,
    VisibilityIconComponent,
  ],
})
export class LibraryTreeComponent {
  protected readonly treeList = viewChild<TreeListComponent>(TreeListComponent);
  protected readonly gridContextMenu =
    viewChild<ContextMenuComponent>(ContextMenuComponent);

  private readonly actions = inject(EntryTaskActionService);
  private readonly category = inject(CategoryService);
  private readonly menuService = inject(LibraryTreeMenuService);
  private readonly store = inject(SignalStore);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(EntryTaskReorderService);
  private readonly taskService = inject(EntryTaskService);
  readonly entryService = inject(EntryService);
  readonly entryStore = inject(EntryStore);
  readonly treeService = new TreeService();

  readonly checkIcon = faCheck;

  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = inject(UiStore).mainContentWidth;

  readonly alert = signal<string | undefined>(undefined);
  readonly selectedTask = signal<TaskViewModel | undefined>(undefined);
  readonly taskSaveStates: Map<string, WritableSignal<SaveState>> = new Map();
  readonly menu = computed(() =>
    this.menuService.buildMenu(
      this.entry().type,
      this.version(),
      this.selectedTask(),
      this.claims()
    )
  );
  readonly disciplines = computed(() =>
    this.category.buildViewModels(this.version().disciplines)
  );
  readonly canEdit = computed(
    () =>
      this.version().status === 'draft' &&
      Utils.contains(this.claims(), LIBRARY_CLAIMS.TASKS.UPDATE)
  );
  readonly canCreate = computed(
    () =>
      this.version().status === 'draft' &&
      Utils.contains(this.claims(), LIBRARY_CLAIMS.TASKS.CREATE)
  );

  constructor() {
    toObservable(this.entryStore.viewModels)
      .pipe(untilDestroyed(this))
      .subscribe((tasks) => this.updateState(tasks ?? []));
  }

  menuItemSelected(action: string): void {
    const taskId = this.selectedTask()?.id;
    const obsOrVoid = this.actions.onAction(
      action,
      this.entryUrl(),
      taskId,
      this.treeService
    );

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.callSave(taskId, obsOrVoid);
      else obsOrVoid.subscribe();
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
    const dragged: TaskViewModel = e.draggedRows[0].dataItem;
    const target: TaskViewModel = e.dropTargetRow?.dataItem;
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
      this.callSave(
        dragged.id,
        this.taskService.saveAsync(results, [], 'Wbs.TasksReordered')
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

  navigateToTask(taskId: string | undefined): void {
    //
    //  Keep this here in case someone double clicks outside a standard row
    //
    if (!taskId) return;

    this.store.dispatch(new Navigate([...this.entryUrl(), 'tasks', taskId]));
  }

  taskTitleChanged(taskId: string, title: string): void {
    this.callSave(taskId, this.taskService.titleChangedAsync(taskId, title));
  }

  private resetTree(): void {
    this.entryStore.setTasks(structuredClone(this.entryStore.tasks() ?? []));
  }

  private setSaveState(taskId: string, state: SaveState): void {
    this.taskSaveStates.get(taskId)?.set(state);
  }

  private updateState(tasks: TaskViewModel[]): void {
    for (const task of tasks ?? []) {
      if (!this.taskSaveStates.has(task.id)) {
        this.taskSaveStates.set(task.id, signal('ready'));
      }
    }
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
}

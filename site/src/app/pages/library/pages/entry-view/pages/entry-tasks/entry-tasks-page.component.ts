import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faCheck,
  faFloppyDisk,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import {
  ContextMenuComponent,
  ContextMenuModule,
} from '@progress/kendo-angular-menu';
import {
  CellClickEvent,
  ColumnComponent,
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
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitle2Component } from '@wbs/components/task-title';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import {
  LIBRARY_CLAIMS,
  LibraryEntry,
  LibraryEntryVersion,
} from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  SignalStore,
  TreeService,
  Utils,
} from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore, UiStore } from '@wbs/core/store';
import { CategoryViewModel, TaskViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import {
  EntryTaskActionService,
  EntryTaskReorderService,
} from '../../services';
import {
  TreeFlagColumnHeaderComponent,
  VisibilityIconComponent,
} from './components';
import { LibraryTreeMenuService } from './services';
import { TreeHeightDirective } from '@wbs/core/directives/tree-height.directive';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './entry-tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LibraryTreeMenuService],
  imports: [
    AlertComponent,
    ButtonModule,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    RouterModule,
    SaveMessageComponent,
    TextBoxModule,
    TranslateModule,
    TaskTitle2Component,
    TaskTitleEditorComponent,
    TreeDisciplineLegendComponent,
    TreeHeightDirective,
    TreeListModule,
    TreeButtonsAddComponent,
    TreeButtonsDownloadComponent,
    TreeButtonsTogglerComponent,
    TreeButtonsUploadComponent,
    TreeFlagColumnHeaderComponent,
    VisibilityIconComponent,
  ],
})
export class TasksPageComponent implements OnInit {
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
  readonly width = inject(UiStore).mainContentWidth;
  readonly treeService = new TreeService();

  readonly checkIcon = faCheck;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;
  readonly faSpinner = faSpinner;

  readonly entryUrl = input.required<string[]>();
  readonly isLoading = computed(
    () => !this.entryStore.entry() || !this.entryStore.version()
  );

  readonly containerHeight = signal(100);
  readonly alert = signal<string | undefined>(undefined);
  readonly selectedTask = signal<TaskViewModel | undefined>(undefined);
  readonly menu = computed(() =>
    this.menuService.buildMenu(
      this.entryStore.entry()!.type,
      this.entryStore.version()!,
      this.selectedTask(),
      this.entryStore.claims()
    )
  );
  readonly disciplines = computed(() =>
    this.category.buildViewModels(this.entryStore.version()!.disciplines)
  );
  readonly canEdit = computed(
    () =>
      this.entryStore.version()!.status === 'draft' &&
      Utils.contains(this.entryStore.claims(), LIBRARY_CLAIMS.TASKS.UPDATE)
  );
  readonly canCreate = computed(
    () =>
      this.entryStore.version()!.status === 'draft' &&
      Utils.contains(this.entryStore.claims(), LIBRARY_CLAIMS.TASKS.CREATE)
  );

  constructor() {
    toObservable(this.entryStore.viewModels)
      .pipe(untilDestroyed(this))
      .subscribe((tasks) => this.treeService.updateState(tasks ?? []));
  }

  ngOnInit(): void {
    this.treeService.expandedKeys = (this.entryStore.viewModels() ?? [])
      .filter((x) => !x.parentId)
      .map((x) => x.id);
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
      if (taskId) this.treeService.callSave(taskId, obsOrVoid);
      else obsOrVoid.subscribe();
    }
  }

  cellClick(e: CellClickEvent): void {
    this.selectedTask.set(e.dataItem);

    if (e.type === 'contextmenu') {
      return;
    }

    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = this.entryStore.viewModels()!;
    const entryType = this.entryStore.entry()!.type;
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
      this.treeService.callSave(
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

  disciplinesChanged(
    treelist: TreeListComponent,
    taskId: string,
    discipilnes: CategoryViewModel[]
  ) {
    treelist.closeCell();
    this.treeService.callSave(
      taskId,
      this.taskService.disciplinesChangedAsync(
        taskId,
        discipilnes.map((x) => x.id)
      )
    );
  }

  taskTitleChanged(
    treelist: TreeListComponent,
    taskId: string,
    title: string
  ): void {
    treelist.closeCell();

    this.treeService.callSave(
      taskId,
      this.taskService.titleChangedAsync(taskId, title)
    );
  }

  private resetTree(): void {
    this.entryStore.setTasks(structuredClone(this.entryStore.tasks() ?? []));
  }
}

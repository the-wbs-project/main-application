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
  WbsPhaseService,
} from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore, UiStore } from '@wbs/core/store';
import { CategoryViewModel, TaskViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import {
  EntryTaskActionService,
  EntryTaskReorderService,
} from '../../../../services';
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
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    RouterModule,
    SaveMessageComponent,
    TextBoxModule,
    TranslateModule,
    TaskTitle2Component,
    TaskTitleEditorComponent,
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
  readonly faFloppyDisk = faFloppyDisk;
  readonly faXmark = faXmark;

  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly width = inject(UiStore).mainContentWidth;

  readonly alert = signal<string | undefined>(undefined);
  readonly selectedTask = signal<TaskViewModel | undefined>(undefined);
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
      .subscribe((tasks) => this.treeService.updateState(tasks ?? []));
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
      const originalEvent = e.originalEvent;
      originalEvent.preventDefault();

      this.gridContextMenu()?.show({
        left: originalEvent.pageX,
        top: originalEvent.pageY,
      });
      return;
    }

    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
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

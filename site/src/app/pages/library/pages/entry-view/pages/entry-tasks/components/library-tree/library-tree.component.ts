import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
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
import {
  TreeButtonsAddComponent,
  TreeButtonsDownloadComponent,
  TreeButtonsFullscreenComponent,
  TreeButtonsTogglerComponent,
  TreeButtonsUploadComponent,
} from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { TreeHeightDirective } from '@wbs/core/directives/tree-height.directive';
import { LIBRARY_CLAIMS } from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  TreeService,
  Utils,
} from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore, MetadataStore, UiStore } from '@wbs/core/store';
import { CategoryViewModel, TaskViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import {
  EntryTaskActionService,
  EntryTaskReorderService,
} from '../../../../services';
import { LibraryTaskTitleComponent } from '../library-task-title';
import { VisibilityIconComponent } from '../visibility-icon.component';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-library-tree',
  templateUrl: './library-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    LibraryTaskTitleComponent,
    FontAwesomeModule,
    RouterModule,
    SaveMessageComponent,
    TranslateModule,
    TaskTitleEditorComponent,
    TreeButtonsAddComponent,
    TreeButtonsDownloadComponent,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
    TreeButtonsUploadComponent,
    TreeDisciplineLegendComponent,
    TreeHeightDirective,
    TreeListModule,
    VisibilityIconComponent,
  ],
})
export class LibraryTreeComponent implements OnInit {
  protected readonly treeList = viewChild<TreeListComponent>(TreeListComponent);

  private readonly actions = inject(EntryTaskActionService);
  private readonly category = inject(CategoryService);
  private readonly metadata = inject(MetadataStore);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(EntryTaskReorderService);
  private readonly taskService = inject(EntryTaskService);
  readonly entryService = inject(EntryService);
  readonly entryStore = inject(EntryStore);
  readonly width = inject(UiStore).mainContentWidth;
  readonly treeService = new TreeService();

  readonly faSpinner = faSpinner;

  readonly showFullscreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
  readonly isLoading = computed(
    () => !this.entryStore.entry() || !this.entryStore.version()
  );

  readonly alert = signal<string | undefined>(undefined);
  readonly selectedTask = signal<TaskViewModel | undefined>(undefined);
  readonly disciplines = computed(() => {
    let d = this.entryStore.version()!.disciplines;

    if (!d || d.length === 0)
      d = this.metadata.categories.disciplines.map((x) => ({
        ...x,
        isCustom: false,
      }));

    return this.category.buildViewModels(d);
  });
  readonly showPrivate = computed(
    () =>
      this.entryStore.version()!.status === 'draft' &&
      Utils.contains(this.entryStore.claims(), LIBRARY_CLAIMS.TASKS.UPDATE)
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
  readonly pageSize = computed(() => {
    const height = this.containerHeight() - 50 - 48 - 36;
    const rows = Math.floor(height / 31.5);

    return Math.max(20, rows * 2);
  });
  readonly navigateToTask = output<string>();
  readonly goFullScreen = output<void>();

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

  menuItemSelected(action: string, taskId?: string): void {
    if (action === 'viewTask') {
      if (taskId) this.navigateToTask.emit(taskId!);
    }
    const obsOrVoid = this.actions.onAction(action, taskId, this.treeService);

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.treeService.callSave(taskId, obsOrVoid);
      else obsOrVoid.subscribe();
    }
  }

  cellClick(e: CellClickEvent): void {
    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
  }

  nav(): void {
    const taskId = this.selectedTask()?.id;
    //
    //  Keep this here in case someone double clicks outside a standard row
    //
    if (!taskId) return;

    this.navigateToTask.emit(taskId);
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

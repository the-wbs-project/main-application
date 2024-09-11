import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faXmark } from '@fortawesome/pro-light-svg-icons';
import { faPlus, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SplitterModule } from '@progress/kendo-angular-layout';
import {
  RowClassArgs,
  RowReorderEvent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import {
  TreeButtonsFullscreenComponent,
  TreeButtonsTogglerComponent,
} from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { LIBRARY_CLAIMS, LibraryEntryNode } from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  TreeService,
  Utils,
} from '@wbs/core/services';
import {
  EntryStore,
  MembershipStore,
  MetadataStore,
  UiStore,
} from '@wbs/core/store';
import {
  CategoryViewModel,
  LibraryTaskViewModel,
  TaskViewModel,
} from '@wbs/core/view-models';
import { Observable, tap } from 'rxjs';
import {
  LibraryService,
  EntryTaskReorderService,
  LibraryTaskService,
  LibraryTaskActionService,
} from '../../../../services';
import { LibraryTaskDetailsComponent } from '../library-task-details';
import { LibraryTreeTaskTitleComponent } from '../library-tree-task-title';
import { LibraryTreeTitleLegendComponent } from '../library-tree-title-legend';
import { VisibilityIconComponent } from '../visibility-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-library-tree',
  templateUrl: './library-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    LibraryTaskDetailsComponent,
    LibraryTreeTaskTitleComponent,
    LibraryTreeTitleLegendComponent,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SplitterModule,
    TextBoxModule,
    TranslateModule,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    HeightDirective,
    TreeListModule,
    VisibilityIconComponent,
  ],
})
export class LibraryTreeComponent implements OnInit {
  protected readonly treeList = viewChild<TreeListComponent>(TreeListComponent);

  private readonly actions = inject(LibraryTaskActionService);
  private readonly category = inject(CategoryService);
  private readonly metadata = inject(MetadataStore);
  private readonly messages = inject(Messages);
  private readonly membership = inject(MembershipStore);
  private readonly reorderer = inject(EntryTaskReorderService);
  private readonly taskService = inject(LibraryTaskService);
  readonly entryService = inject(LibraryService);
  readonly entryStore = inject(EntryStore);
  readonly width = inject(UiStore).mainContentWidth;
  readonly treeService = new TreeService();

  readonly addIcon = faPlus;
  readonly cancelIcon = faXmark;
  readonly saveIcon = faSave;
  readonly removeIcon = faTrash;
  readonly heightOffset = 10;
  readonly rowHeight = 31.5;
  editParentId?: string;
  editItem?: LibraryTaskViewModel;
  editForm?: FormGroup;

  readonly showFullscreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
  readonly isLoading = computed(() => !this.entryStore.version());

  readonly alert = signal<string | undefined>(undefined);
  readonly taskAreaHeight = signal(0);
  readonly selectedTaskId = signal<string | undefined>(undefined);
  readonly selectedTask = computed(() => {
    const id = this.selectedTaskId();
    if (!id) return undefined;
    return this.entryStore.viewModels()?.find((x) => x.id === id);
  });
  readonly disciplines = computed(() => {
    let d = this.entryStore.version()!.disciplines;

    if (!d || d.length === 0)
      d = this.metadata.categories.disciplines.map((x) => ({
        ...x,
        isCustom: false,
      }));

    return this.category.buildViewModels(d);
  });
  readonly showInternal = computed(() => {
    const org = this.membership.membership()?.name;
    const version = this.entryStore.version()!;

    return version.visibility === 'public' && org === version.ownerId;
  });
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
  readonly pageSize = computed(() =>
    this.treeService.pageSize(
      this.containerHeight(),
      this.heightOffset,
      this.rowHeight
    )
  );
  //
  //  Outputs
  //
  readonly goFullScreen = output<void>();

  constructor() {
    effect(() =>
      this.treeService.updateState(this.entryStore.viewModels() ?? [])
    );
  }

  ngOnInit(): void {
    this.treeService.expandedKeys = (this.entryStore.viewModels() ?? [])
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  closeTask(): void {
    this.selectedTaskId.set(undefined);
    this.treeList()!.updateView();
  }

  menuItemSelected(action: string, taskId?: string): void {
    if (!taskId) return;

    const obsOrVoid = this.actions.handleAction(action, taskId);

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.treeService.callSave(taskId, obsOrVoid).subscribe();
      else obsOrVoid.subscribe();
    }
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = this.entryStore.viewModels()!;
    const entryType = this.entryStore.version()!.type;
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
      this.treeService
        .callSave(
          dragged.id,
          this.taskService.saveAsync(results, [], 'Wbs.TasksReordered')
        )
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

  disciplinesChanged(
    treelist: TreeListComponent,
    taskId: string,
    discipilnes: CategoryViewModel[]
  ) {
    treelist.closeCell();
    this.treeService
      .callSave(
        taskId,
        this.taskService.disciplinesChangedAsync(
          taskId,
          discipilnes.map((x) => x.id)
        )
      )
      .subscribe();
  }

  taskTitleChanged(
    treelist: TreeListComponent,
    taskId: string,
    title: string
  ): void {
    treelist.closeCell();

    this.treeService
      .callSave(taskId, this.taskService.titleChangedAsync(taskId, title))
      .subscribe();
  }

  rowCallback = (context: RowClassArgs) => {
    const vm = context.dataItem as LibraryTaskViewModel;

    return {
      'bg-light-blue-f':
        vm.visibility === 'private' || vm.visibility === 'impliedPrivate',
    };
  };

  addHandler(parent: LibraryTaskViewModel | undefined): void {
    // Close the current edited row, if any.
    this.closeEditor();
    this.editParentId = parent?.id;

    const sender = this.treeList()!;
    // Expand the parent.
    if (parent) {
      sender.expand(parent);
    }

    // Define all editable fields validators and default values
    this.editForm = new FormGroup({
      parentId: new FormControl(parent?.id),
      title: new FormControl('', Validators.required),
      disciplines: new FormControl([]),
    });

    // Show the new row editor, with the `FormGroup` build above
    sender.addRow(this.editForm, parent);
  }

  closeEditor(dataItem = this.editItem): void {
    this.treeList()?.closeRow(undefined, true);
    this.editItem = undefined;
    this.editForm = undefined;
    this.editParentId = undefined;
  }

  saveHandler(): void {
    const editForm = this.editForm!;

    if (editForm.invalid) return;
    // Collect the current state of the form.
    // The `editForm` argument is the same as was provided when calling `editRow`.
    const title = editForm.value.title;
    const disciplines: CategoryViewModel[] = editForm.value.disciplines;
    const task: Partial<LibraryEntryNode> = {
      title,
      parentId: editForm.value.parentId,
      disciplineIds: disciplines.map((x) => x.id),
    };

    this.treeService
      .callSave(
        this.editParentId!,
        this.taskService.createTask(task.parentId, task).pipe(
          tap((taskId) => {
            this.treeList()?.scrollTo({
              column: 0,
              row: -1,
            });
            this.closeEditor();
          })
        )
      )
      .subscribe();
  }

  removeHandler(task: LibraryTaskViewModel): void {
    const taskId = task.id;
    const sender = this.treeList()!;
    const parent = task.parentId
      ? this.entryStore.viewModels()?.find((x) => x.id === task.parentId)
      : undefined;

    this.treeService
      .callSave(
        taskId,
        this.taskService.removeTask(taskId).pipe(
          tap(() => {
            if (parent) sender.reload(parent);
          })
        )
      )
      .subscribe();
  }

  private resetTree(): void {
    this.entryStore.setTasks(structuredClone(this.entryStore.tasks() ?? []));
  }
}

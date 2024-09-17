import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faXmark } from '@fortawesome/pro-light-svg-icons';
import { faPlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SplitterModule } from '@progress/kendo-angular-layout';
import {
  RowReorderEvent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import {
  TreeButtonsAddComponent,
  TreeButtonsFullscreenComponent,
  TreeButtonsTogglerComponent,
} from '@wbs/components/_utils/tree-buttons';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import {
  AddPhaseOptions,
  PROJECT_CLAIMS,
  PROJECT_STATI,
} from '@wbs/core/models';
import { Messages, TreeService, Utils } from '@wbs/core/services';
import {
  CategoryViewModel,
  ProjectTaskViewModel,
  TaskViewModel,
} from '@wbs/core/view-models';
import { UiStore } from '@wbs/core/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskDeleteComponent } from '../../../../components/task-delete';
import {
  ProjectImportService,
  ProjectTaskService,
  ProjectViewService,
} from '../../../../services';
import { ProjectStore } from '../../../../stores';
import { PhaseTreeReorderService } from '../../services';
import { AbsDialogComponent } from '../abs-dialog/abs-dialog.component';
import { PhaseTaskDetailsComponent } from '../phase-task-details';
import { PhaseTreeOtherButtonComponent } from '../phase-tree-other-button.component';
import { PhaseTreeTitleLegendComponent } from '../phase-tree-title-legend';
import { PhaseTreeTaskTitleComponent } from '../phase-tree-task-title';
import { TreeTypeButtonComponent } from '../tree-type-button.component';
import { WbsAbsButtonComponent } from '../wbs-abs-button.component';

@Component({
  standalone: true,
  selector: 'wbs-project-phase-tree',
  templateUrl: './phase-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhaseTreeReorderService],
  imports: [
    AlertComponent,
    ButtonModule,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    HeightDirective,
    PhaseTaskDetailsComponent,
    PhaseTreeOtherButtonComponent,
    PhaseTreeTaskTitleComponent,
    PhaseTreeTitleLegendComponent,
    ReactiveFormsModule,
    SplitterModule,
    TextBoxModule,
    TranslateModule,
    TreeButtonsAddComponent,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
    TreeTypeButtonComponent,
    WbsAbsButtonComponent,
  ],
})
export class ProjectPhaseTreeComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly importService = inject(ProjectImportService);
  private readonly messages = inject(Messages);
  private readonly reorderer = inject(PhaseTreeReorderService);
  private readonly taskService = inject(ProjectTaskService);

  readonly width = inject(UiStore).mainContentWidth;
  readonly projectStore = inject(ProjectStore);
  readonly viewService = inject(ProjectViewService);
  readonly treeService = new TreeService();
  editParentId?: string;
  editItem?: ProjectTaskViewModel;
  editForm?: FormGroup;
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  readonly isFullScreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
  readonly view = model.required<'phases' | 'disciplines'>();
  readonly wbsAbs = model.required<'wbs' | 'abs'>();
  //
  //  components
  //
  readonly treeList = viewChild<TreeListComponent>(TreeListComponent);
  //
  //  Constaints
  //
  readonly addIcon = faPlus;
  readonly cancelIcon = faXmark;
  readonly saveIcon = faSave;
  readonly removeIcon = faTrash;
  readonly heightOffset = 10;
  readonly rowHeight = 31.5;
  //
  //  signals/models
  //
  readonly taskAreaHeight = signal(0);
  //readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly selectedTaskId = signal<string | undefined>(undefined);
  readonly alert = signal<string | undefined>(undefined);
  //
  //  Computed signals
  //
  readonly tasks = computed(() =>
    this.wbsAbs() === 'wbs'
      ? this.projectStore.viewModels()
      : this.projectStore.absTasks()
  );
  readonly selectedTask = computed(() =>
    this.tasks()?.find((x) => x.id === this.selectedTaskId())
  );
  readonly canEdit = computed(
    () =>
      this.projectStore.project()?.status === PROJECT_STATI.PLANNING &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.TASKS.CREATE)
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
  readonly exitFullScreen = output<void>();

  constructor() {
    effect(() => {
      this.treeService.updateState(this.projectStore.viewModels() ?? []);
    });
  }

  ngOnInit(): void {
    this.treeService.expandedKeys = (this.projectStore.viewModels() ?? [])
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  otherItemSelected(action: string): void {
    if (action === 'goFullScreen') {
      this.goFullScreen.emit();
    } else if (action === 'exitFullScreen') {
      this.exitFullScreen.emit();
    } else if (action === 'editAbs') {
      AbsDialogComponent.launchAsync(
        this.dialogService,
        this.treeService.expandedKeys
      );
    }
  }

  rowReordered(e: RowReorderEvent): void {
    const tree = structuredClone(this.projectStore.viewModels() ?? []);
    const dragged: TaskViewModel = e.draggedRows[0].dataItem;
    const target: TaskViewModel = e.dropTargetRow?.dataItem;
    const validation = this.reorderer.validate(dragged, target, e.dropPosition);

    if (!validation.valid) {
      this.alert.set(validation.errorMessage);
      this.resetTree();
      return;
    } else {
      this.alert.set(undefined);
    }
    const run = () => {
      const results = this.reorderer.run(tree, dragged, target, e.dropPosition);

      this.taskService.treeReordered(dragged.id, results).subscribe();
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

  addPhase(type: AddPhaseOptions): void {
    if (type === 'create') {
      this.addHandler(undefined);
    } else if (type === 'importFile') {
      this.importService.importFromFileAsync().subscribe();
    } else if (type === 'importLibrary') {
      this.importService.importFromLibraryAsync().subscribe();
    }
  }

  menuItemSelected(action: string, taskId: string): void {
    const obsOrVoid = this.viewService.action(action, taskId);

    if (obsOrVoid instanceof Observable) {
      if (taskId && action === 'deleteTask') {
        this.treeService.callSave(taskId, obsOrVoid, 0).subscribe(() => {
          if (taskId === this.selectedTaskId()) {
            this.selectedTaskId.set(undefined);
          }
        });
      } else if (taskId) {
        this.treeService.callSave(taskId, obsOrVoid).subscribe();
      } else {
        obsOrVoid.subscribe();
      }
    }
  }

  addHandler(parent: ProjectTaskViewModel | undefined): void {
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

  closeEditor(): void {
    this.treeList()?.closeRow(undefined, true);
    this.editItem = undefined;
    this.editForm = undefined;
    this.editParentId = undefined;
  }

  saveHandler(): void {
    const editForm = this.editForm!;

    if (editForm.invalid) return;

    const disciplines: CategoryViewModel[] = editForm.value.disciplines;

    this.treeService
      .callSave(
        this.editParentId!,
        this.taskService
          .createTask(
            editForm.value.parentId,
            editForm.value.title,
            undefined,
            disciplines.map((x) => x.id)
          )
          .pipe(tap((taskId) => this.closeEditor()))
      )
      .subscribe();
  }

  removeHandler(task: ProjectTaskViewModel): void {
    const taskId = task.id;
    const sender = this.treeList()!;
    const parent = task.parentId
      ? this.projectStore.viewModels()?.find((x) => x.id === task.parentId)
      : undefined;

    TaskDeleteComponent.launchAsync(this.dialogService).subscribe((reason) => {
      if (!reason) return;

      this.treeService
        .callSave(
          taskId,
          this.taskService.remove(taskId, reason).pipe(
            tap(() => {
              if (parent) sender.reload(parent);
            }),
            tap(() => {
              const selected = this.selectedTaskId();

              if (selected === taskId) {
                this.selectedTaskId.set(undefined);
              }
            })
          )
        )
        .subscribe();
    });
  }

  private resetTree(): void {
    this.projectStore.resetTasks();
  }
}

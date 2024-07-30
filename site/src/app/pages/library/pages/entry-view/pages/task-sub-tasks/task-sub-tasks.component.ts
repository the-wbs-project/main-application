import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import {
  CellClickEvent,
  ColumnComponent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { TreeHeightDirective } from '@wbs/core/directives/tree-height.directive';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import {
  CategoryService,
  SignalStore,
  TreeService,
  Utils,
  WbsNodeService,
} from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { EntryStore, MetadataStore, UiStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { LibraryTaskTitleComponent } from '../../components/library-task-title';
import { EntryTaskActionService } from '../../services';

@Component({
  standalone: true,
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    LibraryTaskTitleComponent,
    SaveMessageComponent,
    TaskTitleEditorComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeHeightDirective,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class SubTasksComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly actions = inject(EntryTaskActionService);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(SignalStore);
  private readonly taskService = inject(EntryTaskService);

  readonly width = inject(UiStore).mainContentWidth;
  readonly entryStore = inject(EntryStore);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly entryUrl = input.required<string[]>();
  readonly taskId = input.required<string>();
  //
  //  Constaints
  //
  readonly heightOffset = 50;
  readonly rowHeight = 31.5;
  //
  //  Signals
  //
  readonly containerHeight = signal(100);
  readonly selectedTaskId = signal<string | undefined>(undefined);
  readonly alert = signal<string | undefined>(undefined);
  //
  //  Computed
  //
  readonly subTasks = computed(() =>
    WbsNodeService.getSubTasksForTree(
      this.entryStore.viewModels() ?? [],
      this.taskId()
    )
  );
  readonly canEdit = computed(
    () =>
      this.entryStore.version()!.status === 'draft' &&
      Utils.contains(this.entryStore.claims(), PROJECT_CLAIMS.TASKS.CREATE)
  );
  readonly disciplines = computed(() => {
    let d = this.entryStore.version()!.disciplines;

    if (!d || d.length === 0)
      d = this.metadata.categories.disciplines.map((x) => ({
        ...x,
        isCustom: false,
      }));

    return this.categoryService.buildViewModels(d);
  });
  readonly pageSize = computed(() =>
    this.treeService.pageSize(
      this.containerHeight(),
      this.heightOffset,
      this.rowHeight
    )
  );

  constructor() {
    effect(() => this.treeService.updateState(this.subTasks() ?? []));
  }

  ngOnInit(): void {}

  navigate(): void {
    const taskId = this.taskId();
    //
    //  Keep this here in case someone double clicks outside a standard row
    //
    if (taskId)
      this.store.dispatch(new Navigate([...this.entryUrl(), 'tasks', taskId]));
  }

  onCellClick(e: CellClickEvent): void {
    this.selectedTaskId.set(e.dataItem.id);

    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
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

  menuItemSelected(action: string, taskId?: string): void {
    const obsOrVoid = this.actions.onAction(action, taskId, this.treeService);

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.treeService.callSave(taskId, obsOrVoid);
      else obsOrVoid.subscribe();
    }
  }
}

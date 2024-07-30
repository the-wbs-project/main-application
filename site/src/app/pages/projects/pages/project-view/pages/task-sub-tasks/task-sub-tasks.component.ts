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
  SignalStore,
  TreeService,
  Utils,
  WbsNodeService,
} from '@wbs/core/services';
import { UiStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ChangeTaskBasics, ChangeTaskDisciplines } from '../../actions';
import { PhaseTaskTitleComponent } from '../../components/phase-task-title';
import { ProjectViewService } from '../../services';
import { ProjectState, TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    PhaseTaskTitleComponent,
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
  private readonly store = inject(SignalStore);
  readonly width = inject(UiStore).mainContentWidth;
  readonly service = inject(ProjectViewService);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly projectUrl = input.required<string[]>();
  //
  //  Constaints
  //
  readonly heightOffset = 50;
  readonly rowHeight = 31.5;
  //
  //  Signals
  //
  readonly containerHeight = signal(100);
  readonly taskId = signal<string | undefined>(undefined);
  readonly alert = signal<string | undefined>(undefined);
  //
  //  Store items
  //
  readonly claims = this.store.select(ProjectState.claims);
  readonly currentProject = this.store.select(ProjectState.current);
  readonly tasks = this.store.select(TasksState.phases);
  readonly task = this.store.select(TasksState.current);
  //
  //  Computed
  //
  readonly subTasks = computed(() =>
    WbsNodeService.getSubTasksForTree(this.tasks() ?? [], this.task()?.id ?? '')
  );
  readonly canEdit = computed(
    () =>
      this.currentProject()?.status === PROJECT_STATI.PLANNING &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.TASKS.CREATE)
  );
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
      this.store.dispatch(
        new Navigate([...this.projectUrl(), 'tasks', taskId])
      );
  }

  onCellClick(e: CellClickEvent): void {
    this.taskId.set(e.dataItem.id);

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
      this.store.dispatch(
        new ChangeTaskDisciplines(
          taskId,
          discipilnes.map((x) => x.id)
        )
      )
    );
  }

  taskTitleChanged(
    treelist: TreeListComponent,
    taskId: string,
    title: string
  ): void {
    treelist.closeCell();

    const task = this.tasks()?.find((x) => x.id === taskId);

    if (!task) return;

    this.treeService.callSave(
      taskId,
      this.store.dispatch(
        new ChangeTaskBasics(
          taskId,
          title,
          task.description ?? '',
          task.absFlag === 'set'
        )
      )
    );
  }

  menuItemSelected(item: string, taskId?: string): void {
    const obsOrVoid = this.service.action(item, taskId);

    if (obsOrVoid instanceof Observable) {
      if (taskId) this.treeService.callSave(taskId, obsOrVoid);
      else {
        //@ts-ignore
        obsOrVoid.subscribe();
      }
    }
  }
}

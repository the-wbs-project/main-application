import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  CellClickEvent,
  ColumnComponent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { LibraryEntryNode } from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  Transformers,
  TreeService,
  sorter,
} from '@wbs/core/services';
import { MembershipStore, UiStore } from '@wbs/core/store';
import {
  LibraryViewModel,
  LibraryTaskViewModel,
  LibraryVersionViewModel,
  CategoryViewModel,
} from '@wbs/core/view-models';
import { TaskTitleComponent } from './components';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { forkJoin } from 'rxjs';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DataServiceFactory } from '@wbs/core/data-services';

@Component({
  standalone: true,
  selector: 'wbs-task-view',
  templateUrl: './task-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    HeightDirective,
    LoaderModule,
    TaskTitleComponent,
    TaskTitleEditorComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class TaskViewComponent implements OnChanges, OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly transformer = inject(Transformers);
  private readonly org = inject(MembershipStore).membership;

  readonly treeService = new TreeService();
  readonly refreshIcon = faRefresh;

  readonly selected = input.required<LibraryViewModel>();
  readonly version = model.required<LibraryVersionViewModel | undefined>();
  readonly versionDisciplines = model.required<CategoryViewModel[]>();
  readonly tasks = model.required<LibraryTaskViewModel[]>();

  readonly containerHeight = signal(100);
  readonly loadingTree = signal(false);
  readonly width = inject(UiStore).mainContentWidth;
  readonly pageSize = computed(() => {
    const height = this.containerHeight() - 50 - 48 - 36;
    const rows = Math.floor(height / 31.5);

    return Math.max(20, rows * 2);
  });
  readonly reloadTree = output<void>();

  ngOnInit(): void {
    this.treeService.expandedKeys = this.tasks()
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected'] && this.selected()) {
      this.loadTree();
    }
  }

  onCellClick(e: CellClickEvent): void {
    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
  }

  removeTask(taskId: string): void {
    this.messages.confirm
      .show(
        'General.Confirm',
        'Are you sure you want to remove this task (and any sub-tasks)?'
      )
      .subscribe((answer) => {
        if (!answer) return;

        this.tasks.update((tasks) => {
          const index = tasks.findIndex((t) => t.id === taskId);
          const task = tasks[index];

          if (!task) return tasks;

          tasks.splice(index, 1);
          //
          //  Remove the task and its children
          //
          for (const child of task.childrenIds) {
            const childIndex = tasks.findIndex((t) => t.id === child);
            if (childIndex > -1) tasks.splice(childIndex, 1);
          }
          //
          //  Update the sibling's order
          //
          const siblings = tasks
            .filter((x) => x.parentId === task.parentId)
            .sort((a, b) => sorter(a.order, b.order));

          for (let i = 0; i < siblings.length; i++) {
            siblings[i].order = i + 1;
          }
          return [...tasks];
        });
      });
  }

  taskTitleChanged(
    treelist: TreeListComponent,
    item: LibraryTaskViewModel,
    title: string
  ): void {
    treelist.closeCell();

    item.title = title;
  }

  loadTree(): void {
    const vm = this.selected()!;

    this.loadingTree.set(true);

    const visibility = this.org()?.name === vm.ownerId ? 'private' : 'public';

    forkJoin({
      version: this.data.libraryEntryVersions.getByIdAsync(
        vm.ownerId,
        vm.entryId,
        vm.version
      ),
      tasks: this.data.libraryEntryNodes.getAllAsync(
        vm.ownerId,
        vm.entryId,
        vm.version,
        visibility
      ),
    }).subscribe(({ version, tasks }) => {
      const disciplines = this.categoryService.buildViewModels(
        this.version()?.disciplines
      );

      this.version.set(version);
      this.versionDisciplines.set(disciplines);
      this.tasks.set(
        this.transformer.nodes.phase.view.forLibrary(
          version,
          tasks,
          disciplines
        )
      );
      this.loadingTree.set(false);
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
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
import { LibraryEntryNode, LibraryEntryVersion } from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  Transformers,
  TreeService,
  sorter,
} from '@wbs/core/services';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskTitle2Component } from '@wbs/components/task-title';
import { TaskTitleEditorComponent } from '@wbs/components/task-title-editor';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { UiStore } from '@wbs/core/store';
import { LibraryViewModel, LibraryTaskViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-library-import-tree',
  templateUrl: './library-import-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    TaskTitle2Component,
    TaskTitleEditorComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class LibraryImportTreeComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly messages = inject(Messages);
  private readonly transformer = inject(Transformers);
  readonly treeService = new TreeService();

  readonly refreshIcon = faRefresh;
  readonly containerHeight = input.required<number>();
  readonly entry = input.required<LibraryViewModel>();
  readonly version = input.required<LibraryEntryVersion>();
  readonly tasks = model.required<LibraryEntryNode[]>();
  readonly width = inject(UiStore).mainContentWidth;
  readonly disciplines = computed(() =>
    this.categoryService.buildViewModels(this.version()!.disciplines)
  );
  readonly viewModels = computed(() =>
    this.transformer.nodes.phase.view.forLibrary(
      this.entry(),
      this.tasks(),
      this.disciplines()
    )
  );
  readonly pageSize = computed(() => {
    const height = this.containerHeight() - 50 - 48 - 36;
    const rows = Math.floor(height / 31.5);

    return Math.max(20, rows * 2);
  });
  readonly reloadTree = output<void>();

  ngOnInit(): void {
    this.treeService.expandedKeys = this.viewModels()
      .filter((x) => !x.parentId)
      .map((x) => x.id);
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
          const vm = this.viewModels().find((t) => t.id === taskId);

          if (index < 0 || !vm) return tasks;

          tasks.splice(index, 1);
          //
          //  Remove the task and its children
          //
          for (const child of vm.childrenIds) {
            const childIndex = tasks.findIndex((t) => t.id === child);
            if (childIndex > -1) tasks.splice(childIndex, 1);
          }
          //
          //  Update the sibling's order
          //
          const siblings = tasks
            .filter((x) => x.parentId === vm.parentId)
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
}

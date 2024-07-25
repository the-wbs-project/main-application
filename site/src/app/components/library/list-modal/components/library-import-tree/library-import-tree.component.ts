import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  CellClickEvent,
  ColumnComponent,
  SelectableSettings,
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
import { LibraryEntryViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-library-import-tree',
  templateUrl: './library-import-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    DisciplinesDropdownComponent,
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

  readonly entry = input.required<LibraryEntryViewModel>();
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
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

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

  titleChanged(taskId: string, title: string): void {
    this.tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return tasks;

      task.title = title;

      return [...tasks];
    });
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
}

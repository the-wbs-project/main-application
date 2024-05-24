import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { LibraryEntryNode, LibraryEntryVersion } from '@wbs/core/models';
import {
  CategoryService,
  Messages,
  Transformers,
  TreeService,
} from '@wbs/core/services';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { TaskTitleComponent } from '@wbs/components/task-title';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { UiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-library-import-tree',
  templateUrl: './library-import-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    TaskTitleComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class LibraryImportTreeComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly messages = inject(Messages);
  private readonly transformer = inject(Transformers);
  readonly treeService = new TreeService();

  readonly entryType = input.required<string>();
  readonly version = input.required<LibraryEntryVersion>();
  readonly tasks = model.required<LibraryEntryNode[]>();
  readonly width = inject(UiStore).mainContentWidth;
  readonly disciplines = computed(() =>
    this.categoryService.buildViewModels(this.version()!.disciplines)
  );
  readonly viewModels = computed(() =>
    this.transformer.nodes.phase.view.run(
      this.tasks(),
      this.entryType(),
      this.disciplines()
    )
  );

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

          for (const child of vm.subTasks) {
            const childIndex = tasks.findIndex((t) => t.id === child.id);
            if (childIndex > -1) tasks.splice(childIndex, 1);
          }
          return [...tasks];
        });
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { CategoryService, SignalStore, TreeService } from '@wbs/core/services';
import { EntryStore, UiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class SubTasksComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly store = inject(SignalStore);

  readonly entryStore = inject(EntryStore);
  readonly treeService = new TreeService();

  readonly entryUrl = input.required<string[]>();
  readonly taskId = input.required<string>();

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly width = inject(UiStore).mainContentWidth;
  readonly task = this.entryStore.getTask(this.taskId);
  readonly disciplines = computed(() =>
    this.categoryService.buildViewModels(this.entryStore.version()!.disciplines)
  );

  clickedId?: string;

  navigate(e: any): void {
    //
    //  Keep this here in case someone double clicks outside a standard row
    //
    if (!this.clickedId) return;

    this.store.dispatch(
      new Navigate([...this.entryUrl(), 'tasks', this.clickedId])
    );
  }
}

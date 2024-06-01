import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SignalStore, TreeService } from '@wbs/core/services';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { UiStore } from '@wbs/core/store';
import { ProjectState, TasksState } from '../../states';

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
  private readonly store = inject(SignalStore);

  readonly treeService = new TreeService();
  readonly projectUrl = input.required<string[]>();
  readonly width = inject(UiStore).mainContentWidth;
  readonly project = this.store.select(ProjectState.current);
  readonly task = this.store.select(TasksState.current);

  clickedId?: string;

  navigate(): void {
    //
    //  Keep this here in case someone double clicks outside a standard row
    //
    if (!this.clickedId) return;

    this.store.dispatch(
      new Navigate([...this.projectUrl(), 'tasks', this.clickedId])
    );
  }
}

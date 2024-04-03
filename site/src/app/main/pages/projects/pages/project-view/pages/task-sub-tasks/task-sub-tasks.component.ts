import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SignalStore } from '@wbs/core/services';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { TreeTogglerComponent } from '@wbs/main/components/tree-toggler.component';
import { TreeService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import { ProjectState, TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
    TreeTogglerComponent,
  ],
})
export class SubTasksComponent {
  private readonly store = inject(SignalStore);

  readonly treeService = new TreeService();

  readonly projectUrl = input.required<string[]>();

  readonly width = this.store.select(UiState.mainContentWidth);
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

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { UiState } from '@wbs/main/states';
import { EntryState } from '../../services';

@Component({
  standalone: true,
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class SubTasksComponent {
  private readonly store = inject(SignalStore);

  readonly state = inject(EntryState);
  readonly entryUrl = input.required<string[]>();
  readonly taskId = input.required<string>();

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly width = this.store.select(UiState.mainContentWidth);
  readonly task = this.state.getTask(this.taskId);

  clickedId?: string;

  navigate(): void {
    this.store.dispatch(
      new Navigate([...this.entryUrl(), 'tasks', this.clickedId])
    );
  }
}

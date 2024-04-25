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
import { TreeTogglerComponent } from '@wbs/main/components/tree-toggler.component';
import { TreeService } from '@wbs/main/services';
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
    TreeTogglerComponent,
  ],
})
export class SubTasksComponent {
  private readonly store = inject(SignalStore);

  readonly state = inject(EntryState);
  readonly treeService = new TreeService();

  readonly entryUrl = input.required<string[]>();
  readonly taskId = input.required<string>();

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly width = this.store.select(UiState.mainContentWidth);
  readonly task = this.state.getTask(this.taskId);

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

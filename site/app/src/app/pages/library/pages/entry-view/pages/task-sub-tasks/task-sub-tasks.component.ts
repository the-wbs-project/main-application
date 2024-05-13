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
import { SignalStore, TreeService } from '@wbs/core/services';
import { DisciplineIconListComponent } from '@wbs/components/_utils/discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '@wbs/components/tree-discipline-legend';
import { TreeTogglerComponent } from '@wbs/components/_utils/tree-toggler.component';
import { EntryStore, UiStore } from '@wbs/core/store';

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

  readonly entryStore = inject(EntryStore);
  readonly treeService = new TreeService();

  readonly entryUrl = input.required<string[]>();
  readonly taskId = input.required<string>();

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly width = inject(UiStore).mainContentWidth;
  readonly task = this.entryStore.getTask(this.taskId);

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

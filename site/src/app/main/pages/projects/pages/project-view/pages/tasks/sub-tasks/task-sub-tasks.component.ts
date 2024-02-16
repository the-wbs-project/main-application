import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  SelectableSettings,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { DisciplineIconListComponent } from '@wbs/main/components/discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '@wbs/main/components/tree-discipline-legend';
import { UiState } from '@wbs/main/states';
import { ProjectNavigationService } from '../../../services';
import { ProjectState, TasksState } from '../../../states';

@Component({
  standalone: true,
  selector: 'wbs-task-sub-tasks',
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
  ],
})
export class TaskSubTasksComponent {
  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly width = toSignal(this.store.select(UiState.mainContentWidth));
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly task = toSignal(this.store.select(TasksState.current));

  clickedId?: string;
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };
  constructor(
    readonly navigate: ProjectNavigationService,
    private readonly store: Store
  ) {}
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { UiState } from '@wbs/core/states';
import { ProjectNavigationService } from '../../services';
import { ProjectState, TasksState } from '../../states';
import { WbsTreeComponent } from '@wbs/main/components/wbs-tree';

@Component({
  standalone: true,
  selector: 'wbs-task-sub-tasks',
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WbsTreeComponent]
})
export class TaskSubTasksComponent {
  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly width = toSignal(this.store.select(UiState.mainContentWidth));
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly task = toSignal(this.store.select(TasksState.current));

  constructor(
    readonly navigate: ProjectNavigationService,
    private readonly store: Store
  ) {}
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { UiState } from '@wbs/core/states';
import { ProjectNavigationService, ProjectViewService } from '../../services';
import { ProjectState, TasksState } from '../../states';

@Component({
  templateUrl: './project-phases-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPhasesPageComponent {
  taskId?: string;

  readonly width = toSignal(this.store.select(UiState.mainContentWidth));
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly phases = toSignal(this.store.select(TasksState.phases));
  readonly phaseIds = toSignal(this.store.select(ProjectState.phaseIds));
  readonly task = toSignal(this.store.select(TasksState.current));

  constructor(
    readonly navigate: ProjectNavigationService,
    readonly service: ProjectViewService,
    readonly store: Store
  ) {}
}

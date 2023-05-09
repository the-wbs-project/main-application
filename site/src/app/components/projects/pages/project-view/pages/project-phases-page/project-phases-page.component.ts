import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { UiState } from '@wbs/core/states';
import { TaskViewState } from '../../states';
import { ProjectNavigationService, ProjectViewService } from '../../services';
import { ProjectState } from '../../../../states';

@Component({
  templateUrl: './project-phases-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPhasesPageComponent {
  taskId?: string;

  readonly width = toSignal(this.store.select(UiState.mainContentWidth));
  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly phases = toSignal(this.store.select(ProjectState.phases));
  readonly phaseIds = toSignal(this.store.select(ProjectState.phaseIds));
  readonly task = toSignal(this.store.select(TaskViewState.current));

  constructor(
    readonly navigate: ProjectNavigationService,
    readonly service: ProjectViewService,
    readonly store: Store
  ) {}
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { ProjectChecklistState, ProjectState, TasksState } from '../../states';

@Component({
  templateUrl: './project-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAboutPageComponent {
  private readonly store = inject(Store);

  readonly project = toSignal(
    this.store.select(ProjectState.current).pipe(map((p) => p!))
  );
  readonly taskCount = toSignal(this.store.select(TasksState.taskCount));
  readonly users = toSignal(this.store.select(ProjectState.users));
  readonly checklist = toSignal(
    this.store.select(ProjectChecklistState.results)
  );
}

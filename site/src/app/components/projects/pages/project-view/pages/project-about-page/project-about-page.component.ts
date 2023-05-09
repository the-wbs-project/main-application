import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './project-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAboutPageComponent {
  private readonly store = inject(Store);

  readonly project = toSignal(
    this.store.select(ProjectState.current).pipe(map((p) => p!))
  );
  readonly users = toSignal(this.store.select(ProjectState.users));
}

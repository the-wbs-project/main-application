import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserRole } from '@wbs/core/models';
import { map, Observable } from 'rxjs';
import { ProjectState } from '../../../../states';

@Component({
  templateUrl: './project-about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAboutPageComponent {
  readonly roles$: Observable<UserRole[] | undefined>;

  constructor(store: Store) {
    this.roles$ = store.select(ProjectState.current).pipe(map((p) => p?.roles));
  }
}

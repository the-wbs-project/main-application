import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectLite, PROJECT_FILTER } from '@app/models';
import { AuthState, ProjectState } from '@app/states';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate, RouterDataResolved } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'wbs-navbar',
  templateUrl: './component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Select(AuthState.name) name$: Observable<string> | undefined;
  @Select(ProjectState.navType) projectNavType$:
    | Observable<PROJECT_FILTER | null>
    | undefined;
  @Select(ProjectState.list) projects$: Observable<ProjectLite[]> | undefined;
  @Select(ProjectState.watched) watched$: Observable<ProjectLite[]> | undefined;

  page: string | undefined;
  pagePrefix: string | undefined;

  constructor(actions$: Actions, private readonly store: Store) {
    actions$
      .pipe(ofActionSuccessful(RouterDataResolved), untilDestroyed(this))
      .subscribe((action: RouterDataResolved) => {
        this.page = action.routerState.url;
        this.pagePrefix = action.routerState.url?.split('/')[1];
      });
  }

  navigate(segments: string[]) {
    this.store.dispatch(new Navigate(segments));
  }
}

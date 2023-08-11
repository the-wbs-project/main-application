import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ProjectService, Resources, TitleService } from '@wbs/core/services';
import { SetHeaderInfo } from '@wbs/main/actions';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs/operators';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store
    .dispatch(
      new Navigate([
        '/',
        owner,
        'projects',
        'list',
        route.params['type'],
        'active',
      ])
    )
    .pipe(map(() => true));
};

export const titleGuard = (route: ActivatedRouteSnapshot) => {
  const resources = inject(Resources);
  const title = inject(TitleService);
  const projectService = inject(ProjectService);
  const prefix = resources.get('Pages.Projects');
  const status = route.params['status'];

  if (status) {
    const statusText = projectService.getStatus(status);

    title.setTitle(statusText, false);
  } else {
    title.setTitle(prefix, false);
  }

  return true;
};

export const headerGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store
    .dispatch(
      new SetHeaderInfo({
        title: 'General.Projects',
        titleIsResource: true,
        rightButtons: [
          {
            text: 'Projects.CreateProject',
            icon: faPlus,
            route: ['/', owner, 'projects', 'create'],
            theme: 'primary',
            type: 'link',
          },
        ],
      })
    )
    .pipe(map(() => true));
};

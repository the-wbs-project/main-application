import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { HeaderInformation } from '@wbs/core/models';
import { ProjectService, Resources, TitleService } from '@wbs/core/services';
import { SetHeaderInfo } from '@wbs/main/actions';
import { map } from 'rxjs/operators';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(
      new Navigate([
        '/',
        route.params['owner'],
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

export const headerGuard = (info: HeaderInformation) => {
  const store = inject(Store);

  return store.dispatch(new SetHeaderInfo(info)).pipe(map(() => true));
};

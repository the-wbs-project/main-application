import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';
import { map, switchMap } from 'rxjs/operators';
import { SetHeaderInformation, StartWizard } from '../actions';
import { PROJECT_CREATION_PAGES } from '../models';
import { ProjectCreateState } from '../states';
import { of } from 'rxjs';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { Resources } from '@wbs/core/services';

function redirect(store: Store, route: ActivatedRouteSnapshot) {
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store
    .dispatch(
      new Navigate([
        '/' + owner,
        'projects',
        'create',
        PROJECT_CREATION_PAGES.GETTING_STARTED,
      ])
    )
    .pipe(map(() => true));
}

export const redirectGuard = (route: ActivatedRouteSnapshot) =>
  redirect(inject(Store), route);

export const setupGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const resources = inject(Resources);
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return (
    store.dispatch([
      new SetHeaderInformation(route.data['title'], route.data['description']),
      new SetBreadcrumbs(
        [
          {
            route: ['/', owner, 'projects'],
            label: 'General.Projects',
          },
          {
            route: ['/', owner, 'projects', 'create'],
            label: 'General.Create',
          },
        ],
        resources.get(route.data['title'] ?? '')
      ),
    ]),
    map(() => true)
  );
};

export const startWizardGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store.dispatch(new StartWizard(owner)).pipe(map(() => true));
};

export const verifyWizardGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .selectOnce(ProjectCreateState.isWizardActive)
    .pipe(switchMap((answer) => (answer ? of(true) : redirect(store, route))));
};

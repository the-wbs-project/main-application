import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/core/services';
import { UiStore } from '@wbs/store';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SetHeaderInformation, StartWizard } from '../actions';
import { PROJECT_CREATION_PAGES } from '../models';
import { ProjectCreateState } from '../states';

function redirect(store: Store, route: ActivatedRouteSnapshot) {
  const owner = Utils.getParam(route, 'org');

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
  const owner = Utils.getParam(route, 'org');

  inject(UiStore).setBreadcrumbs([
    {
      route: ['/', owner, 'projects'],
      text: 'General.Projects',
    },
    {
      route: ['/', owner, 'projects', 'create'],
      text: 'General.Create',
    },
    {
      text: route.data['title'],
    },
  ]);
  return store.dispatch(
    new SetHeaderInformation(route.data['title'], route.data['description'])
  );
};

export const startWizardGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getParam(route, 'org');

  return store.dispatch(new StartWizard(owner)).pipe(map(() => true));
};

export const verifyWizardGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .selectOnce(ProjectCreateState.isWizardActive)
    .pipe(switchMap((answer) => (answer ? of(true) : redirect(store, route))));
};

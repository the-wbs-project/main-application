import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SetHeaderInformation, StartWizard } from '../actions';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../models';
import { LibraryEntryCreateService } from '../services';
import { LibraryCreateState } from '../states';

export const setupGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

  return (
    store.dispatch([
      new SetHeaderInformation(
        route.data['pageTitle'],
        route.data['pageDescription']
      ),
      new SetBreadcrumbs([
        {
          route: ['/', owner, 'library'],
          text: 'General.Library',
        },
        {
          route: ['/', owner, 'library', 'create'],
          text: 'General.Create',
        },
        {
          text: route.data['pageTitle'],
        },
      ]),
    ]),
    map(() => true)
  );
};

export const startWizardGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

  return store.dispatch(new StartWizard(owner)).pipe(map(() => true));
};

export const verifyWizardGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const service = inject(LibraryEntryCreateService);
  const owner = Utils.getOrgName(store, route);

  return store
    .selectOnce(LibraryCreateState.isWizardActive)
    .pipe(
      switchMap((answer) =>
        answer
          ? of(true)
          : service
              .nav(owner, LIBRARY_ENTRY_CREATION_PAGES.GETTING_STARTED)
              .pipe(map(() => true))
      )
    );
};

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const service = inject(LibraryEntryCreateService);
  const owner = Utils.getOrgName(store, route);

  return service
    .nav(owner, LIBRARY_ENTRY_CREATION_PAGES.GETTING_STARTED)
    .pipe(map(() => true));
};

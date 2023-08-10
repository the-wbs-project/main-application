import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { ProjectCreateState } from './states';
import { StartWizard } from './actions';
import { MembershipState } from '@wbs/main/states';

export const startCreationGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store.dispatch(new StartWizard(owner)).pipe(map(() => true));
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [startCreationGuard],
    loadComponent: () =>
      import('./project-create.component').then(
        (x) => x.ProjectCreateComponent
      ),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([ProjectCreateState])),
    ],
  },
];

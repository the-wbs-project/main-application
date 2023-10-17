import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_CLAIMS } from '@wbs/core/models';
import { Transformers, Utils } from '@wbs/main/services';
import { map, switchMap } from 'rxjs/operators';
import { SetProject } from './actions';
import { ProjectUploadState } from './states';

const verifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);
  const projectId = route.params['projectId'];
  const owner = Utils.getOrgName(store, route);

  return data.claims
    .getProjectClaimsAsync(owner, projectId)
    .pipe(map((claims) => claims.includes(PROJECT_CLAIMS.TASKS.UPDATE)));
};

const startGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);
  const projectId = route.params['projectId'];
  const owner = Utils.getOrgName(store, route);

  return data.projects.getAsync(owner, projectId).pipe(
    switchMap((project) => store.dispatch(new SetProject(project))),
    map(() => true)
  );
};

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [verifyGuard, startGuard],
    loadComponent: () =>
      import('./project-upload-layout.component').then(
        (x) => x.ProjectUploadLayoutComponent
      ),

    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),

    providers: [
      importProvidersFrom(NgxsModule.forFeature([ProjectUploadState])),
      Transformers,
    ],
  },
];

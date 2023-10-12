import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_CLAIMS } from '@wbs/core/models';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs/operators';
import { ProjectUploadState } from './states';

const projectUploadVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);
  const projectId = route.params['projectId'];
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return data.claims
    .getProjectClaimsAsync(owner, projectId)
    .pipe(map((claims) => claims.includes(PROJECT_CLAIMS.TASKS.UPDATE)));
};

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectUploadVerifyGuard],
    loadComponent: () =>
      import('./project-upload-layout.component').then(
        (x) => x.ProjectUploadLayoutComponent
      ),

    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),

    providers: [
      importProvidersFrom(NgxsModule.forFeature([ProjectUploadState])),
    ],
  },
];

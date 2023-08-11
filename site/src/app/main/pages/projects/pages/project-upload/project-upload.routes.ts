import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs/operators';
import { SetProject } from './actions';
import { ProjectUploadState } from './states';

const projectUploadVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store
    .dispatch(new SetProject(owner, route.params['projectId']))
    .pipe(map(() => true));
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

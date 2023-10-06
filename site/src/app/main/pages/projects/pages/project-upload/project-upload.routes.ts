import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_CLAIMS } from '@wbs/core/models';
import { UpdateProjectClaims } from '@wbs/main/actions';
import { AuthState, MembershipState, PermissionsState } from '@wbs/main/states';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProjectUploadState } from './states';

const projectUploadVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);
  const projectId = route.params['projectId'];
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return store.selectOnce(PermissionsState.projectId).pipe(
    //
    //  If the permissions state doesn't have claims for the project we're uploading, change it
    //
    switchMap((id) => {
      if (id === projectId) return of();

      return data.projects.getAsync(owner, projectId).pipe(
        tap((project) => {
          const userId = store.selectSnapshot(AuthState.userId)!;
          const roles = project.roles
            .filter((pr) => pr.userId === userId)
            .map((pr) => pr.role);

          return store.dispatch(new UpdateProjectClaims(project.id, roles));
        })
      );
    }),
    switchMap(() => store.selectOnce(PermissionsState.claims)),
    map((claims) => claims.includes(PROJECT_CLAIMS.TASKS.UPDATE))
  );
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

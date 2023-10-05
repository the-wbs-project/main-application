import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { ProjectPermissionsService } from '@wbs/main/services';
import { MembershipState } from '@wbs/main/states';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SetProject } from './actions';
import { ProjectUploadState } from './states';
import { PROJECT_PERMISSION_KEYS } from '@wbs/core/models';

const projectUploadVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const permissions = inject(ProjectPermissionsService);
  const projectId = route.params['projectId'];
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  return permissions.getPermissionsByIdAsync(owner, projectId).pipe(
    switchMap((permissions) => {
      const canUpload = permissions.get(PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS);

      if (!canUpload) return of(false);

      return store
        .dispatch(new SetProject(owner, projectId))
        .pipe(map(() => true));
    })
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

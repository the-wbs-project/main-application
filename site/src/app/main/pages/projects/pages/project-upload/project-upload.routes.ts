import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { SetProject } from './actions';

const projectUploadVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(new SetProject(route.params['projectId']))
    .pipe(map(() => true));
}

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectUploadVerifyGuard],
    loadComponent: () =>
      import('./project-upload-layout.component').then(({ ProjectUploadLayoutComponent }) => ProjectUploadLayoutComponent),

    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),
  },
];

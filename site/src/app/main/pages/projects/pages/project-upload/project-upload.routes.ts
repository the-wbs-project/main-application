import { Routes } from '@angular/router';
import { ProjectUploadVerifyGuard } from './guards';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [ProjectUploadVerifyGuard],
    loadComponent: () =>
      import('./project-upload-layout.component').then(({ ProjectUploadLayoutComponent }) => ProjectUploadLayoutComponent),

    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),
  },
];

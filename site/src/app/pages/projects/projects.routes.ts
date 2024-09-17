import { Routes } from '@angular/router';
import { ProjectActivityService, ProjectTaskActivityService } from './services';

export const routes: Routes = [
  {
    path: '',
    providers: [ProjectActivityService, ProjectTaskActivityService],
    loadChildren: () =>
      import('./pages/project-list/project-list.routes').then((x) => x.routes),
  },
  {
    path: 'view',
    providers: [ProjectActivityService, ProjectTaskActivityService],
    loadChildren: () =>
      import('./pages/project-view/project-view.routes').then((x) => x.routes),
  },
];

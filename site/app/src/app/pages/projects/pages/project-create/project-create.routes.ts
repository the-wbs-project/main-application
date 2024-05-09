import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { ProjectCreateService } from './services';
import { ProjectCreateState } from './states';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-create.component').then(
        (x) => x.ProjectCreateComponent
      ),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([ProjectCreateState])),
      ProjectCreateService,
    ],
    loadChildren: () =>
      import('./sub-pages/children.routes').then((m) => m.routes),
  },
];

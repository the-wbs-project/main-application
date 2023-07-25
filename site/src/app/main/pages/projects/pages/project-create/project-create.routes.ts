import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { StartCreationGuard } from './guards';
import { ProjectCreateState } from './states';

export const routes: Routes = [
  {
    path: '',
    canActivate: [StartCreationGuard],
    loadComponent: () =>
      import('./project-create.component').then(({ ProjectCreateComponent }) => ProjectCreateComponent),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          ProjectCreateState
        ])
      ),
    ]
  },
];

import { Routes } from '@angular/router';
import { dirtyGuard } from '@wbs/main/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },

  {
    path: 'general',
    canDeactivate: [dirtyGuard],
    loadComponent: () =>
      import('./general/general.component').then(
        (x) => x.TaskSettingsGeneralComponent
      ),
  },
  {
    path: 'disciplines',
    canDeactivate: [dirtyGuard],
    loadComponent: () =>
      import('./disciplines.component').then(
        (x) => x.TaskSettingDisciplineComponent
      ),
  },
];

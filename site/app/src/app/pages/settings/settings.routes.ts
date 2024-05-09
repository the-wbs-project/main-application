import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { settingsReadGuard } from '@wbs/core/guards';
import { SettingsState } from './states';

export const routes: Routes = [
  {
    path: '',
    canActivate: [settingsReadGuard],
    loadComponent: () =>
      import('./settings-layout.component').then(
        (m) => m.SettingsLayoutComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
    providers: [importProvidersFrom(NgxsModule.forFeature([SettingsState]))],
  },
];

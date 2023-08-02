import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { adminGuard } from '@wbs/main/guards';
import { SettingsState, UserAdminState } from './states';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./settings-layout.component').then(
        (m) => m.SettingsLayoutComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([SettingsState, UserAdminState])
      ),
    ],
  },
];

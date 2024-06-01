import { Routes } from '@angular/router';
import { MemberSettingsService } from './members/services';
import { MembersSettingStore } from './members/store';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'members',
    pathMatch: 'full',
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./members/members.component').then((m) => m.MembersComponent),
    providers: [MemberSettingsService, MembersSettingStore],
  },
];

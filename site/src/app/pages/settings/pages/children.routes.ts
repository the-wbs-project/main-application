import { Routes } from '@angular/router';
import { MemberSettingsService } from './membership/services';
import { MembersSettingStore } from './membership/store';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'membership',
    pathMatch: 'full',
  },
  {
    path: 'membership',
    loadComponent: () =>
      import('./membership/membership.component').then(
        (m) => m.MembershipComponent
      ),
    providers: [MemberSettingsService, MembersSettingStore],
  },
];

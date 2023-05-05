import { MenuItem } from '@wbs/core/models';

export const ORG_SETTINGS_MENU_ITEMS: MenuItem[] = [
  {
    title: 'Settings.Organization',
    description: 'Settings.OrganizationDescription',
    path: ['/settings', 'general'],
    icon: 'fa-building',
  },
  {
    title: 'General.Users',
    description: 'Settings.UsersDescription',
    path: ['/settings', 'users', 'active'],
    icon: 'fa-users',
  },
  {
    title: 'Settings.Invites',
    description: 'Settings.InvitesDescription',
    path: ['/settings', 'invites'],
    icon: 'fa-envelope',
  },
];

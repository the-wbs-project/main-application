import { MenuItem } from '@wbs/shared/models';

export const ORG_SETTINGS_MENU_ITEMS: MenuItem[] = [
  {
    title: 'Settings.Organization',
    description: 'Settings.OrganizationDescription',
    path: ['/settings', 'general'],
    icon: 'fa-building',
  },
  {
    title: 'Settings.Users',
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

import { MenuItem } from '@wbs/core/models';

export const ORG_SETTINGS_MENU_ITEMS: MenuItem[] = [
  {
    title: 'Settings.Organization',
    path: ['settings', 'general'],
    icon: 'fa-building',
  },
  {
    title: 'General.Members',
    path: ['settings', 'members'],
    icon: 'fa-users',
  },
];

import {
  faBuilding,
  faEnvelope,
  faUsers,
} from '@fortawesome/pro-solid-svg-icons';
import { MenuItem } from '@wbs/shared/models';

export const ORG_SETTINGS_MENU_ITEMS: MenuItem[] = [
  {
    title: 'Settings.General',
    description: 'Settings.GeneralDescription',
    path: ['/settings', 'general'],
    icon: faBuilding,
  },
  {
    title: 'Settings.Users',
    description: 'Settings.UsersDescription',
    path: ['/settings', 'users', 'active'],
    icon: faUsers,
  },
  {
    title: 'Settings.Invites',
    description: 'Settings.InvitesDescription',
    path: ['/settings', 'invites'],
    icon: faEnvelope,
  },
];

import {
  faCogs,
  faEnvelope,
  faSpaceStationMoonConstruction,
  faUsers,
} from '@fortawesome/pro-solid-svg-icons';
import { MenuItem } from '@wbs/shared/models';

export const PROJECT_MENU_ITEMS: MenuItem[] = [
  {
    headTitle: 'General.Projects',
  },
  {
    title: 'My Projects',
    titleNotResource: true,
    icon: faSpaceStationMoonConstruction,
    type: 'sub',
    active: true,
    children: [
      {
        title: 'Planning',
        titleNotResource: true,
        type: 'sub',
        children: [
          {
            path: '/projects/view/123',
            titleNotResource: true,
            title: 'Market Research Project',
            type: 'link',
          },
        ],
      },
      {
        title: 'Execution',
        titleNotResource: true,
        type: 'sub',
        children: [],
      },
      {
        title: 'Follow-Up',
        titleNotResource: true,
        type: 'sub',
        children: [],
      },
      {
        title: 'Closed',
        titleNotResource: true,
        type: 'sub',
        children: [],
      },
    ],
  },
];

export const ORG_SETTINGS_MENU_ITEMS: MenuItem[] = [
  {
    headTitle: 'General.Settings',
  },
  {
    title: 'Settings.General',
    description: 'Settings.GeneralDescription',
    path: '/settings/general',
    icon: faCogs,
    type: 'link',
    active: true,
  },
  {
    title: 'Settings.Users',
    description: 'Settings.UsersDescription',
    path: '/settings/users/active',
    icon: faUsers,
    type: 'link',
    active: true,
  },
  {
    title: 'Settings.Invites',
    description: 'Settings.InvitesDescription',
    path: '/settings/invites',
    icon: faEnvelope,
    type: 'link',
    active: true,
  },
];

import { ORGANIZATION_CLAIMS } from '@wbs/core/models';
import { HeaderRouteItem } from './header-route-item.model';

export const HEADER_ROUTE_ITEMS: HeaderRouteItem[] = [
  {
    type: 'link',
    label: 'General.Library',
    section: 'library',
    route: ['/', ':orgId', 'library'],
  },
  {
    type: 'link',
    label: 'General.Projects',
    section: 'projects',
    route: ['/', ':orgId', 'projects'],
  },
  {
    type: 'sub',
    label: 'General.Settings',
    section: 'settings',
    claim: ORGANIZATION_CLAIMS.SETTINGS.READ,
    items: [
      {
        type: 'header',
        label: 'General.Organizational',
      },
      {
        type: 'link',
        route: ['/', ':orgId', 'settings', 'members'],
        label: 'General.Members',
        claim: ORGANIZATION_CLAIMS.MEMBERS.READ,
      },
    ],
  },
];

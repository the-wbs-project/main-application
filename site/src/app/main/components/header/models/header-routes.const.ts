import { ORGANIZATION_CLAIMS, PROJECT_CLAIMS } from '@wbs/core/models';
import { HeaderRouteItem } from './header-route-item.model';

export const HEADER_ROUTE_ITEMS: HeaderRouteItem[] = [
  {
    label: 'General.Projects',
    items: [
      {
        type: 'link',
        route: ['/', ':orgId', 'projects'],
        label: 'General.ProjectList',
      },
      {
        type: 'link',
        route: ['/', ':orgId', 'projects', 'create'],
        label: 'General.CreateProject',
        claim: PROJECT_CLAIMS.CREATE,
      },
    ],
  },
  {
    label: 'General.Settings',
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

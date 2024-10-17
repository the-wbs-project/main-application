import { ActionButtonMenuItem, ORGANIZATION_CLAIMS } from '@wbs/core/models';

export const HEADER_ROUTE_ITEMS: ActionButtonMenuItem[] = [
  {
    resource: 'General.Library',
    section: 'library',
    route: ['/', ':orgId', 'library'],
  },
  {
    resource: 'General.Projects',
    section: 'projects',
    route: ['/', ':orgId', 'projects'],
  },
  {
    resource: 'General.Settings',
    section: 'settings',
    claim: ORGANIZATION_CLAIMS.SETTINGS.READ,
    items: [
      {
        route: ['/', ':orgId', 'settings', 'membership'],
        resource: 'OrgSettings.Membership',
        claim: ORGANIZATION_CLAIMS.MEMBERS.READ,
      },
    ],
  },
];

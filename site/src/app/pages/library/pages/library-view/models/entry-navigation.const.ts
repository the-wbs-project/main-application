import { faInfoCircle, faTasks } from '@fortawesome/pro-solid-svg-icons';
import { RouteContextMenuItem } from '@wbs/core/models';

export const ENTRY_NAVIGATION: RouteContextMenuItem[] = [
  {
    route: ['about'],
    resource: 'General.About',
    faIcon: faInfoCircle,
  },
  {
    route: ['tasks'],
    resource: 'General.Tasks',
    faIcon: faTasks,
  },
];

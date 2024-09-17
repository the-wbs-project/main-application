import {
  faInfoCircle,
  faTasks,
  faTimeline,
} from '@fortawesome/pro-solid-svg-icons';
import { RouteContextMenuItem } from '@wbs/core/models';

export const PROJECT_NAVIGATION: RouteContextMenuItem[] = [
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
  {
    route: ['timeline'],
    resource: 'General.Timeline',
    faIcon: faTimeline,
  },
];

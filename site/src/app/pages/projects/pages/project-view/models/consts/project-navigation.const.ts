import { NavigationLink } from '@wbs/core/models';

export const PROJECT_NAVIGATION: NavigationLink[] = [
  {
    route: ['about'],
    text: 'General.About',
    section: 'about',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: ['tasks'],
    text: 'General.Tasks',
    section: 'tasks',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: ['timeline'],
    text: 'General.Timeline',
    section: 'timeline',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
];

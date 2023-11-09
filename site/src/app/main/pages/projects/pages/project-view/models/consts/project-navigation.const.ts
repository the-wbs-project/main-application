import { PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from '../project-navigation-link.model';
import { PROJECT_PAGES } from './project-pages.const';
import { PROJECT_SETTINGS_NAVIGATION } from './project-settings-navigation.const';

export const PROJECT_NAVIGATION: ProjectNavigationLink[] = [
  {
    classes: ['d-sm-inline', 'd-md-none'],
    title: 'General.Views',
    children: [
      {
        fragment: PROJECT_PAGES.ABOUT,
        title: 'General.About',
      },
      {
        fragment: PROJECT_PAGES.PHASES,
        title: 'General.Phases',
      },
      {
        fragment: PROJECT_PAGES.DISCIPLINES,
        title: 'General.Disciplines',
      },
      {
        fragment: PROJECT_PAGES.TIMELINE,
        title: 'General.Timeline',
      },
      {
        fragment: PROJECT_PAGES.RESOURCES,
        title: 'General.Resources',
      },
    ],
  },
  {
    fragment: PROJECT_PAGES.ABOUT,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.About',
  },
  {
    fragment: PROJECT_PAGES.PHASES,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Phases',
  },
  {
    fragment: PROJECT_PAGES.DISCIPLINES,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Disciplines',
  },
  {
    fragment: PROJECT_PAGES.TIMELINE,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Timeline',
  },
  {
    fragment: PROJECT_PAGES.RESOURCES,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Resources',
  },
  {
    fragment: PROJECT_PAGES.SETTINGS,
    title: 'General.Settings',
    children: PROJECT_SETTINGS_NAVIGATION,
    claim: PROJECT_CLAIMS.SETTINGS.READ,
  },
];

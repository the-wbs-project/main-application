export enum PROJECT_PAGES {
  ABOUT = 'about',
  TASKS = 'tasks',
  DISCUSSIONS = 'discussions',
  TIMELINE = 'timeline',
  RESOURCES = 'resources',
  UPLOAD = 'upload',
  SETTINGS = 'settings',
}

export type PROJECT_PAGES_TYPE =
  | PROJECT_PAGES.ABOUT
  | PROJECT_PAGES.TASKS
  | PROJECT_PAGES.DISCUSSIONS
  | PROJECT_PAGES.RESOURCES
  | PROJECT_PAGES.TIMELINE
  | PROJECT_PAGES.UPLOAD
  | PROJECT_PAGES.SETTINGS;

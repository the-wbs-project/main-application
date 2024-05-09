export enum ENTRY_PAGES {
  ABOUT = 'about',
  TASKS = 'tasks',
  DISCUSSIONS = 'discussions',
  TIMELINE = 'timeline',
  RESOURCES = 'resources',
  UPLOAD = 'upload',
  SETTINGS = 'settings',
}

export type ENTRY_PAGES_TYPE =
  | ENTRY_PAGES.ABOUT
  | ENTRY_PAGES.TASKS
  | ENTRY_PAGES.DISCUSSIONS
  | ENTRY_PAGES.RESOURCES
  | ENTRY_PAGES.TIMELINE
  | ENTRY_PAGES.UPLOAD
  | ENTRY_PAGES.SETTINGS;

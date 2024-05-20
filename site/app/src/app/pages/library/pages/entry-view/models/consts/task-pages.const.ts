export enum TASK_PAGES {
  ABOUT = 'about',
  SUB_TASKS = 'sub-tasks',
  TIMELINE = 'timeline',
  RESOURCES = 'resources',
  SETTINGS = 'settings',
}

export type TASK_PAGES_TYPE =
  | TASK_PAGES.ABOUT
  | TASK_PAGES.SUB_TASKS
  | TASK_PAGES.TIMELINE
  | TASK_PAGES.RESOURCES
  | TASK_PAGES.SETTINGS;

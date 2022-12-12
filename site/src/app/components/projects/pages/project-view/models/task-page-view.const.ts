export enum TASK_PAGE_VIEW {
  ABOUT = 'about',
  SUB_TASKS = 'sub-tasks',
  TIMELINE = 'timeline',
  EDUATION = 'education',
  RESOURCES = 'resources',
}

export type TASK_PAGE_VIEW_TYPE =
  | TASK_PAGE_VIEW.ABOUT
  | TASK_PAGE_VIEW.SUB_TASKS
  | TASK_PAGE_VIEW.TIMELINE
  | TASK_PAGE_VIEW.EDUATION
  | TASK_PAGE_VIEW.RESOURCES;

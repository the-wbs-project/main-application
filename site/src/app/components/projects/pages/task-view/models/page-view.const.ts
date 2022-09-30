export enum PAGE_VIEW {
  ABOUT = 'about',
  SUB_TASKS = 'sub-tasks',
  TIMELINE = 'timeline',
  EDUATION = 'education',
  RESOURCES = 'resources',
}

export type PAGE_VIEW_TYPE =
  | PAGE_VIEW.ABOUT
  | PAGE_VIEW.SUB_TASKS
  | PAGE_VIEW.TIMELINE
  | PAGE_VIEW.EDUATION
  | PAGE_VIEW.RESOURCES;

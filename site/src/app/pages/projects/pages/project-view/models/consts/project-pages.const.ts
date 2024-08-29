export enum PROJECT_PAGES {
  ABOUT = 'about',
  TASKS = 'tasks',
  DISCUSSIONS = 'discussions',
  TIMELINE = 'timeline',
  UPLOAD = 'upload',
}

export type PROJECT_PAGES_TYPE =
  | PROJECT_PAGES.ABOUT
  | PROJECT_PAGES.TASKS
  | PROJECT_PAGES.DISCUSSIONS
  | PROJECT_PAGES.TIMELINE
  | PROJECT_PAGES.UPLOAD;

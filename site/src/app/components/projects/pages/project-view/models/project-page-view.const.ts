export enum PROJECT_PAGE_VIEW {
  ABOUT = 'about',
  PHASES = 'phases',
  DISCIPLINES = 'disciplines',
  TIMELINE = 'timeline',
  UPLOAD = 'upload',
}

export type PROJECT_PAGE_VIEW_TYPE =
  | PROJECT_PAGE_VIEW.ABOUT
  | PROJECT_PAGE_VIEW.PHASES
  | PROJECT_PAGE_VIEW.DISCIPLINES
  | PROJECT_PAGE_VIEW.TIMELINE;
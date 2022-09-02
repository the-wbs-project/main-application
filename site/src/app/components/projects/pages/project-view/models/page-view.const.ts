export enum PAGE_VIEW {
  ABOUT = 'about',
  PHASES = 'phases',
  DISCIPLINES = 'disciplines',
  TIMELINE = 'timeline',
}

export type PAGE_VIEW_TYPE =
  | PAGE_VIEW.ABOUT
  | PAGE_VIEW.PHASES
  | PAGE_VIEW.DISCIPLINES
  | PAGE_VIEW.TIMELINE;

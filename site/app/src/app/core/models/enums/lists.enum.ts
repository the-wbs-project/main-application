export enum LISTS {
  PHASE = 'categories_phase',
  DISCIPLINE = 'categories_discipline',
  ACTIONS = 'actions',
  PROJECT_CATEGORIES = 'project_category',
}

export type LISTS_TYPE =
  | LISTS.DISCIPLINE
  | LISTS.PHASE
  | LISTS.ACTIONS
  | LISTS.PROJECT_CATEGORIES;

export type CAT_LISTS_TYPE = LISTS.DISCIPLINE | LISTS.PHASE;

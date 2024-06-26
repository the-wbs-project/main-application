export enum LIBRARY_ENTRY_TYPES {
  PROJECT = 'project',
  PHASE = 'phase',
  TASK = 'task',
}

export type LIBRARY_ENTRY_TYPES_TYPE =
  | LIBRARY_ENTRY_TYPES.PROJECT
  | LIBRARY_ENTRY_TYPES.PHASE
  | LIBRARY_ENTRY_TYPES.TASK;

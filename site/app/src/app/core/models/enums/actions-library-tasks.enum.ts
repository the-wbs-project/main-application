export enum LIBRARY_TASKS_ACTIONS {
  CREATED = 'library-task-created',
  CLONED = 'library-task-cloned',
  TITLE_CHANGED = 'library-task-title-changed',
  DESCRIPTION_CHANGED = 'library-task-description-changed',
  DISCIPLINES_CHANGED = 'library-task-disciplines-changed',
  REORDERED = 'library-task-reordered',
  REMOVED = 'library-task-removed',
}

export enum LIBRARY_TASKS_REORDER_WAYS {
  MOVE_LEFT = 'move-left',
  MOVE_RIGHT = 'move-right',
  MOVE_UP = 'move-up',
  MOVE_DOWN = 'move-down',
  DRAGGED = 'dragged',
}

export enum LIBRARY_TASKS_ACTIONS {
  CREATED = 'library-task-created',
  CLONED = 'library-task-cloned',
  TITLE_CHANGED = 'library-task-title-changed',
  DESCRIPTION_CHANGED = 'library-task-description-changed',
  DISCIPLINES_CHANGED = 'library-task-disciplines-changed',
  VISIBILITY_CHANGED = 'library-task-visibility-changed',
  REORDERED = 'library-task-reordered',
  REMOVED = 'library-task-removed',
  RESOURCE_ADDED = 'library-task-resource-added',
  RESOURCE_CHANGED = 'library-task-resource-changed',
  RESOURCE_REMOVED = 'library-task-resource-removed',
  RESOURCE_REORDERED = 'library-task-resource-reordered',
}

export enum LIBRARY_TASKS_REORDER_WAYS {
  MOVE_LEFT = 'move-left',
  MOVE_RIGHT = 'move-right',
  MOVE_UP = 'move-up',
  MOVE_DOWN = 'move-down',
  DRAGGED = 'dragged',
}

export enum PROJECT_STATI {
  PLANNING = 'planning',
  APPROVAL = 'approval',
  EXECUTION = 'execution',
  FOLLOW_UP = 'follow-up',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export type PROJECT_STATI_TYPE =
  | PROJECT_STATI.CLOSED
  | PROJECT_STATI.APPROVAL
  | PROJECT_STATI.EXECUTION
  | PROJECT_STATI.FOLLOW_UP
  | PROJECT_STATI.PLANNING
  | PROJECT_STATI.CANCELLED;

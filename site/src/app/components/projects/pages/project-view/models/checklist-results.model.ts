export enum CHECKLIST_RESULTS {
  PASS = 'pass',
  WARN = 'warn',
  FAIL = 'fail',
}

export const CHECKLIST_RESULTS_CONST = {
  FAIL: CHECKLIST_RESULTS.FAIL,
  PASS: CHECKLIST_RESULTS.PASS,
  WARN: CHECKLIST_RESULTS.WARN,
};

export type CHECKLIST_RESULTS_TYPE =
  | CHECKLIST_RESULTS.FAIL
  | CHECKLIST_RESULTS.PASS
  | CHECKLIST_RESULTS.WARN;

export interface ChecklistItemResults {
  description: string;
  result: CHECKLIST_RESULTS_TYPE;
  message?: string;
}

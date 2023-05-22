export type CHECKLIST_OPERATORS = '=' | '!=' | '>' | '>=' | '<' | '<=';

export interface ChecklistGroup {
  id: string;
  description: string;
  listOrder: number;
  tests: ChecklistTest[];
}

export interface ChecklistExistsTest {
  groupId: string;
  description: string;
  type: 'exists';
  path: string;
  listOrder: number;
  failMessage?: string;
}

export interface ChecklistValueTest {
  groupId: string;
  description: string;
  listOrder: number;
  type: 'value' | 'array';
  path: string;
  pass: { op: CHECKLIST_OPERATORS; value: number };
  warn?: { op: CHECKLIST_OPERATORS; value: number };
  failMessage?: string;
  warnMessage?: string;
}

export type ChecklistTest = ChecklistExistsTest | ChecklistValueTest;

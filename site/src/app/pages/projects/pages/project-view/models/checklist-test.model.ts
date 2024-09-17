import { OPERATOR } from '@wbs/core/models';

export interface ChecklistGroup {
  id: string;
  description: string;
  order: number;
  items: ChecklistTest[];
}

export interface ChecklistExistsTest {
  groupId: string;
  description: string;
  type: 'exists';
  path: string;
  order: number;
  failMessage?: string;
}

export interface ChecklistValueTest {
  groupId: string;
  description: string;
  order: number;
  type: 'value' | 'array';
  path: string;
  pass: { op: OPERATOR; value: number };
  warn?: { op: OPERATOR; value: number };
  failMessage?: string;
  warnMessage?: string;
}

export type ChecklistTest = ChecklistExistsTest | ChecklistValueTest;

export interface ChecklistGroup {
  id: string;
  description: string;
  listOrder: number;
  tests: ChecklistTest[];
}

export interface ChecklistTest {
  id: string;
  groupId: string;
  listOrder: number;
  description: string;
}

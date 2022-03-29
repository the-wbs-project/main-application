export interface WbsPhaseNode {
  id: string;
  parentId: string | null;
  disciplines?: string[] | null;
  order: number;
  levels: number[];
  levelText: string;
  title: string;
  children: number;
  isDisciplineNode: boolean;
  syncWithDisciplines?: boolean;
  isLockedToParent: boolean;
}

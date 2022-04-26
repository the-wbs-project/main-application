export interface WbsNodePhaseRelationship {
  parentId: string;
  isDisciplineNode?: boolean;
  order: number;
  levels: number[];
  syncWithDisciplines?: boolean;
}

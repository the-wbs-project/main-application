export interface WbsNodeRelationship {
  parentId: string;
  isDisciplineNode?: boolean;
  order: number;
  levels: number[];
  syncWithDisciplines?: boolean;
}

export interface WbsNodeDisciplineRelationship {
  id: string;
  parentId: string;
  isPhaseNode?: boolean;
  phaseId?: string;
  order: number;
  levels: number[];
}

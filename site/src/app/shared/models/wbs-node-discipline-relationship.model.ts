export interface WbsNodeDisciplineRelationship {
  disciplineId: string;
  parentId: string;
  isPhaseNode?: boolean;
  phaseId?: string;
  order: number;
  //levels: number[];
}

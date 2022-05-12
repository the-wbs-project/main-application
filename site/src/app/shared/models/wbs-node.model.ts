import { TaggedObject } from './app-models';

export interface WbsNode extends TaggedObject {
  id: string;
  title?: string;
  removed?: boolean;
  parentId: string | null;
  order: number;
  description?: string | null;
  disciplineIds?: string[] | null;
  phase?: WbsNodePhaseRelationship;
  discipline?: WbsNodeDisciplineRelationship[];
}

export interface ProjectNode extends WbsNode {
  projectId: string;
}

export interface WbsNodePhaseRelationship {
  isDisciplineNode?: boolean;
  syncWithDisciplines?: boolean;
}

export interface WbsNodeDisciplineRelationship {
  disciplineId: string;
}

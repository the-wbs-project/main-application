import { TaggedObject } from './app-models';
import { WbsNodeDisciplineRelationship } from './wbs-node-discipline-relationship.model';
import { WbsNodePhaseRelationship } from './wbs-node-phase-relationship.model';

export interface WbsNode extends TaggedObject {
  id: string;
  title?: string;
  removed?: boolean;
  description: string | null;
  disciplineIds?: string[] | null;
  phase?: WbsNodePhaseRelationship;
  discipline?: WbsNodeDisciplineRelationship[];
}

export interface ProjectNode extends WbsNode {
  projectId: string;
}

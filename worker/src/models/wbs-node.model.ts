import { TaggedObject } from './app-models';
import { WbsNodeRelationship } from './wbs-node-relationship.model';

export interface WbsNode extends TaggedObject {
  id: string;
  title?: string;
  disciplines?: string[] | null;
  phase?: WbsNodeRelationship;
}

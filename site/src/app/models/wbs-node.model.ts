import { TaggedObject } from './app-models';
import { Activity } from './activity.model';

export interface WbsNode extends TaggedObject {
  id: string;
  levels: { p?: number[]; d?: number[][] };
  title?: string;
  phaseCategoryId?: string;
  disciplineIds?: string[];
  trainingId?: string;
  referenceId?: string;
  activity?: Activity[];
  thread?: any;
}

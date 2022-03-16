import { TaggedObject } from './app-models';
import { Activity } from './activity.model';

export interface WbsNode extends TaggedObject {
  id: string;
  levels: { p: number[]; d: number[] };
  name: string;
  trainingId?: string;
  referenceId?: string;
  activity: Activity[];
  thread: any;
}

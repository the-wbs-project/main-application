import { Activity } from './activity.model';

export interface WbsNode {
  id: string;
  levels: { p: number[]; d: number[] };
  name: string;
  trainingId?: string;
  referenceId?: string;
  activity: Activity[];
  thread: any;
}

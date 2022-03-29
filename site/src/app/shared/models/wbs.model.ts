import { TaggedObject } from './app-models';
import { Activity } from './activity.model';
import { WbsNode } from './wbs-node.model';

export interface Wbs extends TaggedObject {
  id: string;
  version: number;
  promoted: boolean;
  name: string;
  categories: string[];
  activity: Activity[];
  nodes: WbsNode[];
  trainingId?: string;
  author: string;
  contributors: string[];
  language: string;
  thread: any;
}

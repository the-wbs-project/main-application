import { WbsNode } from './wbs-node.model';

export interface WbsChangeRecord {
  original: WbsNode;
  updated: WbsNode;
  action: string;
}

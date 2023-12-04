import { WbsNode } from './wbs-node.model';

export interface LibraryEntryNode extends WbsNode {
  entryId: string;
  entryVersion: number;
}

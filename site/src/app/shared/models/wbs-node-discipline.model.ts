import { WbsNodeView } from './wbs-node-view.model';

export interface WbsDisciplineNode extends WbsNodeView {
  isPhaseNode?: boolean;
  phases?: string[];
}

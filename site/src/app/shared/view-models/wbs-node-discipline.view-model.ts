import { WbsNodeView } from './wbs-node.view-model';

export interface WbsDisciplineNodeView extends WbsNodeView {
  isPhaseNode?: boolean;
  phases?: string[];
}

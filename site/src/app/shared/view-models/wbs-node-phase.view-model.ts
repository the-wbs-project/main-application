import { WbsNodeView } from './wbs-node.view-model';

export interface WbsPhaseNodeView extends WbsNodeView {
  isDisciplineNode: boolean;
  syncWithDisciplines?: boolean;
  isLockedToParent: boolean;
}

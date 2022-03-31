import { WbsNodeView } from './wbs-node-view.model';

export interface WbsPhaseNode extends WbsNodeView {
  isDisciplineNode: boolean;
  syncWithDisciplines?: boolean;
  isLockedToParent: boolean;
}

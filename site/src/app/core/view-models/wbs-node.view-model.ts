import {
  WbsNodeDisciplineRelationship,
  WbsNodePhaseRelationship,
} from '../models';

export interface WbsNodePhaseView extends WbsNodePhaseRelationship {
  isLockedToParent?: boolean;
}

export interface WbsNodeView {
  id: string;
  treeId: string;

  parentId: string | null;
  treeParentId: string | null;

  sameAsId?: string | null;
  sameAsIndex?: number | null;
  sameAsLevelText?: string | null;

  children: number;
  description?: string | null;
  disciplines: string[];
  levels: number[];
  levelText: string;
  depth: number;
  order: number;
  phaseId: string | undefined;
  title: string;
  phaseInfo?: WbsNodePhaseView;
  lastModified: number;
  disciplineInfo?: WbsNodeDisciplineRelationship;

  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

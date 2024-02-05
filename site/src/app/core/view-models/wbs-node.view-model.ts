export interface WbsNodeView {
  id: string;
  treeId: string;

  parentId?: string;
  treeParentId?: string;

  sameAsId?: string;
  sameAsIndex?: number;
  sameAsLevelText?: string;

  children: number;
  childrenIds: string[];
  description?: string;
  disciplines: string[];
  levels: number[];
  levelText: string;
  depth: number;
  order: number;
  phaseId?: string;
  title: string;
  lastModified?: Date;

  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

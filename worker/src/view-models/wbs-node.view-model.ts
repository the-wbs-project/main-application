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
  order: number;
  phaseId: string | undefined;
  title: string;
  lastModified: number;

  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

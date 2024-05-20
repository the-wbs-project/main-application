import { CategoryViewModel } from './category.view-model';

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
  disciplines: CategoryViewModel[];
  levels: number[];
  levelText: string;
  depth: number;
  order: number;
  title: string;
  lastModified?: Date;

  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;

  phaseIdAssociation?: string;
  phaseId?: string;
  phaseLabel?: string;
  parent?: WbsNodeView;
  subTasks: WbsNodeView[];
  previousTaskId?: string;
  nextTaskId?: string;
}

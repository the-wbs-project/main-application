import { CategoryViewModel } from './category.view-model';

export interface TaskViewModel {
  id: string;
  treeId: string;

  parentId?: string;
  treeParentId?: string;

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
  previousTaskId?: string;
  nextTaskId?: string;
}

export interface LibraryTaskViewModel extends TaskViewModel {
  visibility?: 'public' | 'private' | 'impliedPrivate';
}

export interface ProjectTaskViewModel extends TaskViewModel {
  absFlag?: 'set' | 'implied';
}

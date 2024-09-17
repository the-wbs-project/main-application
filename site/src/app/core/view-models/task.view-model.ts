import { LibraryLink, LibraryTaskLink } from '../models';
import { CategoryViewModel } from './category.view-model';

export interface TaskViewModel {
  id: string;
  parentId?: string;

  createdOn?: Date;
  children: number;
  childrenIds: string[];
  description?: string;
  disciplines: CategoryViewModel[];
  levels: number[];
  levelText: string;
  order: number;
  title: string;
  lastModified?: Date;

  canMoveUp: boolean;
  canMoveDown: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;

  phaseIdAssociation?: string;
  phaseId?: string;

  libraryLink?: LibraryLink;
  libraryTaskLink?: LibraryTaskLink;
}

export interface LibraryTaskViewModel extends TaskViewModel {
  visibility?: 'public' | 'private' | 'impliedPrivate';
}

export interface ProjectTaskViewModel extends TaskViewModel {
  absFlag?: 'set' | 'implied';
  absEditFlag?: 'set' | 'implied';
}

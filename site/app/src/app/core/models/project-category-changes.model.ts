import { ProjectCategory } from './project-category.type';

export interface ProjectCategoryChanges {
  categories: ProjectCategory[];
  removedIds: string[];
}

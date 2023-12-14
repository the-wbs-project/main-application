import { ProjectCategory } from './project-category.type';

export interface ProjectNodeToLibraryOptions {
  author: string;
  title: string;
  description: string | null;
  includeResources: boolean;
  categories: string[] | null;
  phase?: ProjectCategory;
  visibility: string;
}

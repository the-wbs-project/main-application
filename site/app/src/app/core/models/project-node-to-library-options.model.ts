import { ProjectCategory } from './project-category.type';

export interface ProjectNodeToLibraryOptions {
  author: string;
  title: string;
  description?: string;
  includeResources: boolean;
  categories?: string[];
  phase?: string;
  visibility: string;
}

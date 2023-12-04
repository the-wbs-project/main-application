import { ProjectCategory } from './project-category.type';

export interface LibraryEntryVersion {
  entryId: string;
  version: number;
  status: string;
  categories: string[];
  disciplines: ProjectCategory[];
  phases: ProjectCategory[];
}

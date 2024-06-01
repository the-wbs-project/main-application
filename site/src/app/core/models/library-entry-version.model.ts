import { ProjectCategory } from './project-category.type';

export interface LibraryEntryVersion {
  entryId: string;
  version: number;
  versionAlias?: number;
  lastModified: Date;
  title: string;
  description?: string;
  status: string;
  categories: string[];
  disciplines: ProjectCategory[];
}

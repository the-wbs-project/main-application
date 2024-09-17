import { ProjectCategory } from './project-category.type';

export interface LibraryEntryVersionBasic {
  version: number;
  versionAlias: string;
  title: string;
  status: string;
}

export interface LibraryEntryVersion {
  entryId: string;
  version: number;
  versionAlias?: string;
  author: string;
  title: string;
  description?: string;
  status: string;
  editors: string[];
  categories: string[];
  disciplines: ProjectCategory[];
  lastModified: Date;
  releaseNotes?: string;
}

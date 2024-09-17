export interface LibraryEntryVersionBasic {
  version: number;
  versionAlias?: number;
  title: string;
  status: string;
}

export interface LibraryEntryVersion {
  entryId: string;
  version: number;
  versionAlias?: number;
  author: string;
  title: string;
  description?: string;
  status: string;
  categories: string[];
  editors: string[];
  disciplines: any[];
  lastModified: Date;
  releaseNotes?: string;
}

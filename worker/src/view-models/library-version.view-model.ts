import { User } from '../models';

export interface LibraryVersionViewModel {
  entryId: string;
  recordId: string;
  ownerId: string;
  ownerName: string;
  version: number;
  versionAlias?: number;
  author: User;
  type: string;
  visibility: string;
  title: string;
  description?: string;
  status: string;
  category: string;
  editors: User[];
  disciplines: any[];
  releaseNotes?: string;
  lastModified: Date;
}

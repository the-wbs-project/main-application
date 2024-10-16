import { User } from '../models';

export interface LibraryVersionViewModel {
  entryId: string;
  ownerId: string;
  ownerName: string;
  recordId: string;
  type: string;
  visibility: string;
  version: number;
  versionAlias?: string;
  author: User;
  title: string;
  description?: string;
  status: string;
  category: string;
  editors: User[];
  disciplines: any[];
  releaseNotes?: string;
  lastModified: Date;
}

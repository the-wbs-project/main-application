import { UserViewModel } from './user.view-model';

export interface LibraryVersionViewModel {
  entryId: string;
  recordId: string;
  ownerId: string;
  ownerName: string;
  version: number;
  versionAlias?: number;
  author: UserViewModel;
  type: string;
  visibility: string;
  title: string;
  description?: string;
  status: string;
  category: string;
  editors: UserViewModel[];
  disciplines: any[];
  releaseNotes?: string;
  lastModified: Date;
}

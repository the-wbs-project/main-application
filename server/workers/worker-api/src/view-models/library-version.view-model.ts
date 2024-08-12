import { UserViewModel } from './user.view-model';

export interface LibraryVersionViewModel {
  entryId: string;
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
  categories: string[];
  editors: UserViewModel[];
  disciplines: any[];
  lastModified: Date;
}

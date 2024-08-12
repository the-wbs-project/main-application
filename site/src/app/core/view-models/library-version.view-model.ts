import { UserViewModel } from './user.view-model';

export interface LibraryVersionViewModel {
  entryId: string;
  ownerId: string;
  ownerName: string;
  type: string;
  visibility: string;
  version: number;
  versionAlias?: string;
  author: UserViewModel;
  title: string;
  description?: string;
  status: string;
  categories: string[];
  editors: UserViewModel[];
  disciplines: any[];
  lastModified: Date;
}

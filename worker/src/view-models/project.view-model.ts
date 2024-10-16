import { LibraryLink, User } from '../models';

export interface UserRoleViewModel {
  role: string;
  user: User;
}

export interface ProjectViewModel {
  id: string;
  recordId: string;
  owner: string;
  createdBy: User;
  title: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  approvalStarted?: boolean;
  status: string;
  mainNodeView: string;
  category: string;
  disciplines: any[];
  roles: UserRoleViewModel[];
  libraryLink?: LibraryLink;
}

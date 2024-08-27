import { LibraryLink } from '../models';
import { UserViewModel } from './user.view-model';

export interface UserRoleViewModel {
  role: string;
  user: UserViewModel;
}

export interface ProjectViewModel {
  id: string;
  recordId: string;
  owner: string;
  createdBy: UserViewModel;
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

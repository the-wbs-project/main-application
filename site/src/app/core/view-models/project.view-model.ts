import {
  LibraryLink,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_STATI_TYPE,
} from '../models';
import { UserViewModel } from './user.view-model';

export interface UserRoleViewModel {
  trackId?: string;
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
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  category: string;
  disciplines: any[];
  roles: UserRoleViewModel[];
  libraryLink?: LibraryLink;
}

import {
  LibraryLink,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_STATI_TYPE,
  ProjectCategory,
  User,
} from '../models';

export interface UserRoleViewModel {
  trackId?: string;
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
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  category: string;
  disciplines: ProjectCategory[];
  roles: UserRoleViewModel[];
  libraryLink?: LibraryLink;
}

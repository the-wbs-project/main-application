import { PROJECT_NODE_VIEW_TYPE, PROJECT_STATI_TYPE } from './enums';
import { LibraryLink } from './library-link.model';
import { ProjectCategory } from './project-category.type';

export interface UserRole {
  role: string;
  userId: string;
}

export interface Project {
  id: string;
  recordId: string;
  owner: string;
  createdBy: string;
  title: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  approvalStarted?: boolean;
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  category: string;
  disciplines: ProjectCategory[];
  roles: UserRole[];
  libraryLink?: LibraryLink;
}

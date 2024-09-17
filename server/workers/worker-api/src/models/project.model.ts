import { LibraryLink } from './library-link.model';

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
  status: string;
  mainNodeView: string;
  category: string;
  disciplines: any[];
  roles: UserRole[];
  libraryLink?: LibraryLink;
}

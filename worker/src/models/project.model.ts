import { LibraryLink } from './library-link.model';

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
  roles: { userId: string; role: string }[];
  libraryLink?: LibraryLink;
}

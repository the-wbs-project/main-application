import { TaggedObject } from './app-models';
import { PROJECT_NODE_VIEW_TYPE, PROJECT_STATI_TYPE, ROLES_TYPE } from './enums';
import { ProjectCategory } from './project-category.type';
import { WbsNode } from './wbs-node.model';

export interface UserRole {
  role: ROLES_TYPE;
  userId: string;
}

export interface Project extends TaggedObject {
  id: string;
  owner: string;
  createdBy: string;
  title: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  category: string;
  roles: UserRole[];
  disciplines: ProjectCategory[];
  phases: ProjectCategory[];
}

export interface ProjectSnapshot extends Project {
  tasks?: WbsNode[];
}

export interface ProjectSnapshotLegacy extends Project {
  //
  //  when migrating to SQL database this way became unnecessary, but there are some snapshots still out there.
  //    Maybe one day I'll fix them
  //
  categories: {
    discipline: ProjectCategory[];
    phase: ProjectCategory[];
  };
  tasks?: WbsNode[];
}

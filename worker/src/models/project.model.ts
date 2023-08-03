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
  createdOn: number;
  lastModified: number;
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  category: string;
  categories: {
    discipline: ProjectCategory[];
    phase: ProjectCategory[];
  };
  roles: UserRole[];
}

export interface ProjectSnapshot extends Project {
  tasks?: WbsNode[];
}

import {
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_STATI_TYPE,
  ROLES_TYPE,
} from './enums';
import { ProjectCategory } from './project-category.type';

export interface UserRole {
  role: ROLES_TYPE;
  userId: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  _ts: number;
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  category: string;
  categories: {
    discipline: ProjectCategory[];
    phase: ProjectCategory[];
  };
  roles: UserRole[];
}

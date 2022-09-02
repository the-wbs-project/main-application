import { PROJECT_NODE_VIEW_TYPE, PROJECT_STATI_TYPE } from './enums';
import { ProjectCategory } from './project-category.type';

export interface Project {
  id: string;
  title: string;
  description: string;
  lastModified: Date;
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  categories: {
    discipline: ProjectCategory[];
    phase: ProjectCategory[];
  };
}

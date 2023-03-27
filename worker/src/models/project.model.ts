import { TaggedObject } from './app-models';
import { ProjectNode } from './project-node.model';

export interface Project extends TaggedObject {
  id: string;
  createdOn: number;
  lastModified: number;
  watchers?: string[];
}

export interface ProjectSnapshot extends Project {
  tasks?: ProjectNode[];
}

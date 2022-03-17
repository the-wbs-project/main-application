import { ProjectStatus } from './project-status.type';
import { WbsNode } from './wbs-node.model';

export interface Project {
  id: string;
  owner: string;
  title: string;
  status: ProjectStatus;
  nodes: WbsNode[];
}

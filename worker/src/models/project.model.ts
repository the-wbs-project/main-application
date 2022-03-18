import { Activity } from './activity.model';
import { PROJECT_STATI } from './enums';
import { WbsNode } from './wbs-node.model';

export interface ProjectLite {
  id: string;
  owner: string;
  title: string;
  lastModified: Date;
  status: PROJECT_STATI;
}

export interface Project {
  id: string;
  owner: string;
  title: string;
  lastModified: Date;
  status: PROJECT_STATI;
  nodes: WbsNode[];
  wbsId: string;
  nodeChanges: any[];
  roles: any[];
  activity: Activity[];
  thread: any;
}

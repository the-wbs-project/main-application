import { Activity } from './activity.model';
import { PROJECT_STATI_TYPE } from './enums';
import { WbsNode } from './wbs-node.model';

export interface ProjectLite {
  id: string;
  owner: string;
  title: string;
  lastModified: Date;
  status: PROJECT_STATI_TYPE;
}

export interface Project extends ProjectLite {
  activity: Activity[];
  categories: {
    d: string[];
    p: string[];
  };
  nodeChanges?: any[];
  nodes: WbsNode[];
  roles?: any[];
  thread?: any;
  wbsId?: string | null;
}

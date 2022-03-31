import { Activity } from './activity.model';
import { PROJECT_STATI_TYPE } from './enums';

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
    discipline: string[];
    phase: string[];
  };
  nodeChanges?: any[];
  roles?: any[];
  thread?: any;
  wbsId?: string | null;
}

import { Activity } from './activity.model';
import { TaggedObject } from './app-models';
import { PROJECT_STATI_TYPE } from './enums';

export interface Project extends TaggedObject {
  id: string;
  owner: string;
  title: string;
  lastModified: Date;
  status: PROJECT_STATI_TYPE;
  activity: Activity[];
  categories: {
    discipline: string[];
    phase: string[];
  };
  roles?: any[];
  thread?: any;
  wbsId?: string | null;
}

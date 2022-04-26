import { Activity } from './activity.model';
import { PROJECT_STATI_TYPE } from './enums';

export interface Project {
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
}

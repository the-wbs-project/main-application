import { Activity } from './activity.model';
import { PROJECT_NODE_VIEW_TYPE, PROJECT_STATI_TYPE } from './enums';
import { ListItem } from './list-item.model';

export interface Project {
  id: string;
  owner: string;
  title: string;
  lastModified: Date;
  status: PROJECT_STATI_TYPE;
  mainNodeView: PROJECT_NODE_VIEW_TYPE;
  activity: Activity[];
  categories: {
    discipline: (string | ListItem)[];
    phase: (string | ListItem)[];
  };
}

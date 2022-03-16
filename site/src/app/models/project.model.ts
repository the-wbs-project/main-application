import { Activity } from './activity.model';

export interface Project {
  id: string;
  orgId: string;
  name: string;
  status: string;
  wbsId: string;
  nodeChanges: any[];
  roles: any[];
  activity: Activity[];
  thread: any;
  lastModified: Date;
}

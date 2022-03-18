import { Activity, ProjectLite } from '@app/models';
import { WbsNodeViewModel } from './wbs-node.view-model';

export interface ProjectViewModel extends ProjectLite {
  nodes: WbsNodeViewModel[];
  wbsId: string;
  nodeChanges: any[];
  roles: any[];
  activity: Activity[];
  thread: any;
}

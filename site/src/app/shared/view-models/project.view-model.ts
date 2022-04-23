import {
  Activity,
  ListItem,
  ProjectLite,
  PROJECT_VIEW_TYPE,
} from '@wbs/models';

export interface ProjectViewModel extends ProjectLite {
  activity: Activity[];
  categories: Map<PROJECT_VIEW_TYPE, ListItem[]>;
  nodeChanges?: any[];
  //nodes: WbsNode[];
  roles?: any[];
  thread?: any;
  wbsId?: string | null;
}

import {
  Activity,
  Category,
  ProjectLite,
  PROJECT_VIEW_TYPE,
  WbsNode,
} from '@wbs/models';

export interface ProjectViewModel extends ProjectLite {
  activity: Activity[];
  categories: Map<PROJECT_VIEW_TYPE, Category[]>;
  nodeChanges?: any[];
  nodes: WbsNode[];
  roles?: any[];
  thread?: any;
  wbsId?: string | null;
}

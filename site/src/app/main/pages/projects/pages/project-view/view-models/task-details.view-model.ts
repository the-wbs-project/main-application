import { PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export interface TaskDetailsViewModel {
  id: string;
  view: PROJECT_NODE_VIEW_TYPE;

  title: string | null;
  description?: string | null;
  disciplines: string[];
  levels: number[];
  levelText: string;
  lastModified: Date;

  parent?: WbsNodeView;
  subTasks: WbsNodeView[];
  childrenIds: string[];

  previousTaskId?: string;
  nextTaskId?: string;
}

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
  lastModified: number;

  parent?: WbsNodeView;
  subTasks: WbsNodeView[];

  previousTaskId?: string;
  nextTaskId?: string;
}

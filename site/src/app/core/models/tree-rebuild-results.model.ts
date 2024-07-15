import { TaskViewModel } from '@wbs/core/view-models';

export interface RebuildResults {
  changedIds: string[];
  rows: TaskViewModel[];
}

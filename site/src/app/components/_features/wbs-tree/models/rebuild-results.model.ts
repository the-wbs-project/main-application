import { WbsNodeView } from '@wbs/core/view-models';

export interface RebuildResults {
  changedIds: string[];
  rows: WbsNodeView[];
}

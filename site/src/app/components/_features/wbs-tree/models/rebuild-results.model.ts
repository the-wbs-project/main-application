import { WbsNodeView } from '@wbs/shared/view-models';

export interface RebuildResults {
  changedIds: string[];
  rows: WbsNodeView[];
}

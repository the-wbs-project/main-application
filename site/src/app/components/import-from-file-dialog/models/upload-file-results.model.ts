import { WbsNode } from '@wbs/core/models';
import { CategoryViewModel } from '@wbs/core/view-models';

export interface UploadFileResults {
  rows: WbsNode[];
  disciplines: CategoryViewModel[];
}

import { WbsNode } from '@wbs/core/models';

export interface TaskCreationResults {
  model: Partial<WbsNode>;
  nav: boolean;
}

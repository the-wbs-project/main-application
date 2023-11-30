import { Project } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export interface ChecklistDataModel {
  project?: Project;
  disciplines?: WbsNodeView[];
  phases?: WbsNodeView[];
}

import { Project } from '@wbs/core/models';
import { TaskViewModel } from '@wbs/core/view-models';

export interface ChecklistDataModel {
  project?: Project;
  disciplines?: TaskViewModel[];
  phases?: TaskViewModel[];
}

import { ProjectViewModel, TaskViewModel } from '@wbs/core/view-models';

export interface ChecklistDataModel {
  project?: ProjectViewModel;
  disciplines?: TaskViewModel[];
  phases?: TaskViewModel[];
}

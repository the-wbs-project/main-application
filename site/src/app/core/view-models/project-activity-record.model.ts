import { ActivityData } from '../models/activity.model';
import { Project } from '../models/project.model';
import { ProjectNode } from '../models/project-node.model';
import { ProjectViewModel } from './project.view-model';

export interface ProjectActivityRecord {
  data: ActivityData;
  project: Project | ProjectViewModel;
  nodes: ProjectNode[];
}

import { ActivityData } from './activity.model';
import { Project } from './project.model';
import { ProjectNode } from './wbs-node.model';

export interface ProjectActivityRecord {
  data: ActivityData;
  project: Project;
  nodes: ProjectNode[];
}

import { Project } from './project.model';

export interface ProjectCreatedQueueMessage {
  project: Project;
  createdBy: string;
}

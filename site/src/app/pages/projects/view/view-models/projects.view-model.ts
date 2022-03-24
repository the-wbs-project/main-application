import { ProjectLite } from '@app/models';

export interface ProjectsViewModel {
  title: string;
  projects: ProjectLite[];
  filters: string[];
}

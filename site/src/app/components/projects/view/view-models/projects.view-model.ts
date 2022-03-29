import { ProjectLite } from '@wbs/models';

export interface ProjectsViewModel {
  title: string;
  projects: ProjectLite[];
  filters: string[];
}

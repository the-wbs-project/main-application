import { Project } from '@app/models';

export interface ProjectsViewModel {
  title: string;
  projects: Project[];
  filters: string[];
}

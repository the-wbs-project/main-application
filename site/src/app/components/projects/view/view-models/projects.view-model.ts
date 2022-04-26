import { Project } from '@wbs/models';

export interface ProjectsViewModel {
  title: string;
  projects: Project[];
  filters: string[];
}

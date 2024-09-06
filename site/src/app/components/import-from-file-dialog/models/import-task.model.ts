import { CategoryViewModel } from '@wbs/core/view-models';
import { ProjectPlanPerson } from './project-plan-person.model';

export interface ImportTask {
  id: string;
  parentId?: string;
  level: string;
  levels: string[];
  title: string;
  childrenIds: string[];
  resources: ProjectPlanPerson[];
  disciplines: CategoryViewModel[];
}

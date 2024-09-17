import { CategoryViewModel } from '@wbs/core/view-models';
import { ProjectPlanPerson } from './project-plan-person.model';

export interface ImportTask {
  id: string;
  order: number;
  parentId?: string;
  levelText: string;
  levels: number[];
  title: string;
  childrenIds: string[];
  resources: ProjectPlanPerson[];
  disciplines: CategoryViewModel[];
  canMoveLeft: boolean;
  canMoveRight: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

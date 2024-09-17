import { Category } from '../category.model';
import { Role } from '../role.model';
import { ResourceType } from './resource.type';

export interface StarterData {
  roles: Role[];
  resources: ResourceType;
  projectCategories: Category[];
  phases: Category[];
  disciplines: Category[];
}

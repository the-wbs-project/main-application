import { PROJECT_STATI_TYPE, UserRole } from '../models';
import { CategoryViewModel } from './category.view-model';

export interface ProjectViewModel {
  id: string;
  owner: string;
  createdBy: string;
  title: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  approvalStarted?: boolean;
  status: PROJECT_STATI_TYPE;
  category: string;
  disciplines: CategoryViewModel[];
  roles: UserRole[];
}

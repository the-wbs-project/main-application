import { ProjectCategory } from './project-category.type';
import { WbsNode } from './wbs-node.model';

export interface ProjectUploadData<T extends WbsNode> {
  disciplines: ProjectCategory[];
  removeIds: string[];
  upserts: T[];
}

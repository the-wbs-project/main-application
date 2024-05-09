import { ProjectCategory } from './project-category.type';
import { WbsNode } from './wbs-node.model';

export interface ProjectUploadData {
  disciplines: ProjectCategory[];
  removeIds: string[];
  upserts: WbsNode[];
}

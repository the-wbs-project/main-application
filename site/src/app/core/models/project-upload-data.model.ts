import { ProjectCategory } from './project-category.type';
import { WbsNode } from './wbs-node.model';

export interface ProjectUploadData {
  phases: ProjectCategory[];
  disciplines: ProjectCategory[];
  removeIds: string[];
  upserts: WbsNode[];
}

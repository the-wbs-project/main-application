import { TaggedObject } from './app-models';

export interface WbsNode extends TaggedObject {
  id: string;
  title?: string;
  removed?: boolean;
  parentId: string | null;
  order: number;
  createdOn: Date;
  lastModified: Date;
  description?: string | null;
  disciplineIds?: string[] | null;
}

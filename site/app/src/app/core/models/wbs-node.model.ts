import { TaggedObject } from './app-models';
import { LibraryLink } from './library-link.model';

export interface WbsNode extends TaggedObject {
  id: string;
  title: string;
  parentId?: string;
  order: number;
  createdOn?: Date;
  lastModified: Date;
  description?: string;
  disciplineIds?: string[];
  phaseIdAssociation?: string;
  libraryLink?: LibraryLink;
}

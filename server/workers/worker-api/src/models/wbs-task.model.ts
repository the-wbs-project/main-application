import { LibraryLink, LibraryTaskLink } from './library-link.model';

export interface WbsTask {
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
  libraryTaskLink?: LibraryTaskLink;
}

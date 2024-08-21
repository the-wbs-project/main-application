import { LibraryEntryNode } from '../models/library-entry-node.model';
import { CategoryViewModel } from './category.view-model';
import { LibraryVersionViewModel } from './library-version.view-model';

export interface LibraryImportResults {
  owner: string;
  entryId: string;
  version: LibraryVersionViewModel;
  disciplines: CategoryViewModel[];
  tasks: LibraryEntryNode[];
  importDisciplines: boolean;
}

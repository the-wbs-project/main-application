import { CategoryViewModel, LibraryVersionViewModel } from '../view-models';
import { LibraryEntryNode } from './library-entry-node.model';

export interface LibraryImportResults {
  owner: string;
  version: LibraryVersionViewModel;
  disciplines: CategoryViewModel[];
  tasks: LibraryEntryNode[];
  importDisciplines: boolean;
}

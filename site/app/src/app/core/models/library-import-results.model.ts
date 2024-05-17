import { CategoryViewModel } from '../view-models';
import { LibraryEntryNode } from './library-entry-node.model';
import { LibraryEntryVersion } from './library-entry-version.model';

export interface LibraryImportResults {
  owner: string;
  version: LibraryEntryVersion;
  disciplines: CategoryViewModel[];
  tasks: LibraryEntryNode[];
  importDisciplines: boolean;
}

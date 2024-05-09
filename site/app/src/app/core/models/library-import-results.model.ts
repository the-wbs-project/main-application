import { LibraryEntryViewModel } from '../view-models';
import { LibraryEntryNode } from './library-entry-node.model';

export interface LibraryImportResults {
  vm: LibraryEntryViewModel;
  tasks: LibraryEntryNode[];
}

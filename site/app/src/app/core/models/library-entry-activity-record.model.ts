import { ActivityData } from './activity.model';
import { LibraryEntry } from './library-entry.model';
import { LibraryEntryVersion } from './library-entry-version.model';
import { LibraryEntryNode } from './library-entry-node.model';

export interface LibraryEntryActivityRecord {
  data: ActivityData;
  entry: LibraryEntry;
  version: LibraryEntryVersion;
  tasks: LibraryEntryNode[];
}

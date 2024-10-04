import { LibraryEntryVersion } from './library-entry-version.model';
import { LibraryEntry } from './library-entry.model';

export interface PublishedEmailQueueMessage {
  //entry: LibraryEntry;
  version: LibraryEntryVersion;
  watchers: string[];
}

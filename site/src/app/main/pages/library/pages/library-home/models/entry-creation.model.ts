import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';

export interface EntryCreationModel {
  entry: LibraryEntry;
  version: LibraryEntryVersion;
  nodes: LibraryEntryNode[];
  action: 'close' | 'view' | 'upload';
}

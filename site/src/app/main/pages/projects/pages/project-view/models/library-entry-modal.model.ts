import { LIBRARY_ENTRY_TYPES_TYPE } from '@wbs/core/models';

export interface LibraryEntryModalModel {
  type: LIBRARY_ENTRY_TYPES_TYPE;
  title: string;
  description: string | null;
  categories: string[] | null;
}

export interface LibraryEntryModalResults {
  type: LIBRARY_ENTRY_TYPES_TYPE;
  title: string;
  description: string | null;
  categories: string[] | null;
  includeResources: boolean;
  visibility: string;
  nav: boolean;
}

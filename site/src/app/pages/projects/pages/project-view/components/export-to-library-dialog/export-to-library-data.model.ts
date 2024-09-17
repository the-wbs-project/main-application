import { LIBRARY_ENTRY_TYPES_TYPE } from '@wbs/core/models';

export interface ExportToLibraryDataModel {
  type: LIBRARY_ENTRY_TYPES_TYPE;
  owner: string;
  projectId: string;
  taskId?: string;
  title: string;
  description?: string;
}

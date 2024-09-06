import {
  CategoryViewModel,
  LibraryTaskViewModel,
  LibraryVersionViewModel,
} from '@wbs/core/view-models';

export interface LibraryImportResults {
  version: LibraryVersionViewModel;
  versionDisciplines: CategoryViewModel[];
  tasks: LibraryTaskViewModel[];
  importProjectAsTask?: boolean;
  onlyImportSubtasks?: boolean;
}

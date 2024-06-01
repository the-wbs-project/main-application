import { Pipe, PipeTransform } from '@angular/core';
import {
  LIBRARY_ENTRY_TYPES,
  LIBRARY_ENTRY_TYPES_TYPE,
} from '@wbs/core/models';

@Pipe({ name: 'libraryEntryTitleHint', standalone: true })
export class LibraryEntryTitleHintPipe implements PipeTransform {
  transform(type: LIBRARY_ENTRY_TYPES_TYPE | undefined): string {
    if (type === LIBRARY_ENTRY_TYPES.PHASE)
      return 'LibraryExport.TitleHintPhase';

    if (type === LIBRARY_ENTRY_TYPES.PROJECT)
      return 'LibraryExport.TitleHintProject';

    if (type === LIBRARY_ENTRY_TYPES.TASK) return 'LibraryExport.TitleHintTask';

    return '';
  }
}

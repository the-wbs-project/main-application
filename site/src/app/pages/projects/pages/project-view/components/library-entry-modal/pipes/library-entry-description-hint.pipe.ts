import { Pipe, PipeTransform } from '@angular/core';
import {
  LIBRARY_ENTRY_TYPES,
  LIBRARY_ENTRY_TYPES_TYPE,
} from '@wbs/core/models';

@Pipe({ name: 'libraryEntryDescriptionHint', standalone: true })
export class LibraryEntryDescriptionHintPipe implements PipeTransform {
  transform(type: LIBRARY_ENTRY_TYPES_TYPE | undefined): string {
    if (type === LIBRARY_ENTRY_TYPES.PHASE)
      return 'LibraryExport.DescriptionHintPhase';

    if (type === LIBRARY_ENTRY_TYPES.PROJECT)
      return 'LibraryExport.DescriptionHintProject';

    if (type === LIBRARY_ENTRY_TYPES.TASK)
      return 'LibraryExport.DescriptionHintTask';

    return '';
  }
}

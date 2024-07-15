import { Pipe, PipeTransform } from '@angular/core';
import { LIBRARY_FILTER_TYPES } from '@wbs/core/models';

@Pipe({ name: 'entryTypeTitle', standalone: true })
export class EntryTypeTitlePipe implements PipeTransform {
  transform(type: string): string {
    return LIBRARY_FILTER_TYPES.find((t) => t.value === type)?.label ?? '??';
  }
}

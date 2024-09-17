import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { LIBRARY_FILTER_TYPES } from '@wbs/core/models';

@Pipe({ name: 'entryTypeIcon', standalone: true })
export class EntryTypeIconPipe implements PipeTransform {
  transform(type: string): IconDefinition {
    return (
      LIBRARY_FILTER_TYPES.find((t) => t.value === type)?.icon ?? faQuestion
    );
  }
}

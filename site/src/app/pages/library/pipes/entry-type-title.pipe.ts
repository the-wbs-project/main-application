import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'entryTypeTitle', standalone: true })
export class EntryTypeTitlePipe implements PipeTransform {
  transform(type: string): string {
    if (type === 'phase') return 'General.Phase';
    if (type === 'project') return 'General.Project';
    if (type === 'task') return 'General.Task';
    return '??';
  }
}

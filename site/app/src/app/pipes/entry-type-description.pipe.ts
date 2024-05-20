import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'entryTypeDescription', standalone: true })
export class EntryTypeDescriptionPipe implements PipeTransform {
  transform(type: string): string {
    if (type === 'phase') return 'LibraryCreate.PhaseTypeDescription';
    if (type === 'project') return 'LibraryCreate.ProjectTypeDescription';
    if (type === 'task') return 'LibraryCreate.TaskTypeDescription';
    return '??';
  }
}

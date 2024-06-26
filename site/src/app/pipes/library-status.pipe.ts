import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'libraryStatus', standalone: true })
export class LibraryStatusPipe implements PipeTransform {
  transform(status: string | undefined): string {
    if (status === 'draft') return 'General.UnderConstruction';
    if (status === 'published') return 'General.Published';
    if (status === 'retired') return 'General.Retired';
    return '';
  }
}

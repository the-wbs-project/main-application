import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'libraryStatus', standalone: true })
export class LibraryStatusPipe implements PipeTransform {
  transform(status: string | undefined): string {
    if (status === 'draft') return 'General.Draft';
    if (status === 'published') return 'General.Published';
    if (status === 'retired') return 'General.Retired';
    if (status === 'cancelled') return 'General.Cancelled';
    return '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { LibraryEntry, RoutedBreadcrumbItem } from '@wbs/core/models';

@Pipe({ name: 'entryViewBreadcrumbs', standalone: true })
export class EntryViewBreadcrumbsPipe implements PipeTransform {
  transform(entry?: LibraryEntry): RoutedBreadcrumbItem[] {
    if (!entry) return [];

    return [
      {
        route: ['/', entry.ownerId, 'library'],
        text: 'General.Library',
      },
      {
        text: 'title', // entry.title,
        isText: true,
      },
    ];
  }
}

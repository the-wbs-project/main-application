import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';

@Pipe({ name: 'projectSort', pure: false, standalone: true })
export class ProjectSortPipe implements PipeTransform {
  transform(
    list: Project[],
    sort: 'modified' | 'name' = 'modified'
  ): Project[] {
    if (list == null || list.length === 0) return list;

    if (sort === 'modified')
      return list.sort((a, b) => sorter(a.lastModified, b.lastModified));

    return list.sort((a, b) => sorter(a.title, b.title));
  }
}

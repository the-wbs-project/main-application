import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '@wbs/core/models';

@Pipe({ name: 'projectSort', pure: false })
export class ProjectSortPipe implements PipeTransform {
  transform(
    list: Project[],
    sort: 'modified' | 'name' = 'modified'
  ): Project[] {
    if (list == null || list.length === 0) return list;

    if (sort === 'modified')
      return list.sort((a, b) => (a.lastModified > b.lastModified ? -1 : 1));

    return list.sort((a, b) => (a.title < b.title ? -1 : 1));
  }
}

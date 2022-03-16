import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '@app/models';

@Pipe({ name: 'projectSort', pure: false })
export class ProjectSortPipe implements PipeTransform {
  transform(list: Project[], sort: 'modified' | 'name'): Project[] {
    if (list == null || list.length === 0) return list;

    if (sort === 'modified')
      return list.sort((a, b) => (a.lastModified > b.lastModified ? -1 : 1));

    return list.sort((a, b) => (a.name > b.name ? -1 : 1));
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { ProjectLite } from '@app/models';

@Pipe({ name: 'projectSort', pure: false })
export class ProjectSortPipe implements PipeTransform {
  transform(list: ProjectLite[], sort: 'modified' | 'name'): ProjectLite[] {
    if (list == null || list.length === 0) return list;

    if (sort === 'modified')
      return list.sort((a, b) => (a.lastModified > b.lastModified ? -1 : 1));

    return list.sort((a, b) => (a.title > b.title ? -1 : 1));
  }
}

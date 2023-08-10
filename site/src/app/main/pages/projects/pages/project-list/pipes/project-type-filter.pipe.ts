import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { AuthState } from '@wbs/main/states';

@Pipe({ name: 'projectTypeFilter', pure: false, standalone: true })
export class ProjectTypeFilterPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    list: Project[] | undefined,
    type: string | undefined
  ): Project[] | undefined {
    if (!list || !type || type === 'all') return list;

    if (type === 'assigned') {
      const userId = this.store.selectSnapshot(AuthState.userId);

      return list.filter(
        (project) =>
          project.roles?.some((role) => role.userId === userId) ?? false
      );
    }
    return list;
  }
}

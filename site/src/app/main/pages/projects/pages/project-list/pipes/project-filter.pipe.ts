import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { ProjectService } from '@wbs/core/services';
import { AuthState } from '@wbs/main/states';
import { ProjectListFilters } from '../models';

@Pipe({ name: 'projectFilter', pure: false, standalone: true })
export class ProjectFilterPipe implements PipeTransform {
  constructor(
    private readonly service: ProjectService,
    private readonly store: Store
  ) {}

  transform(
    list: Project[] | null | undefined,
    filters: ProjectListFilters
  ): Project[] | null | undefined {
    if (list == null || list.length === 0) return list;

    if (filters.search) list = this.service.filterByName(list, filters.search);

    if (filters.assignedToMe) {
      const userId = this.store.selectSnapshot(AuthState.userId);

      list = list.filter(
        (project) =>
          project.roles?.some((role) => role.userId === userId) ?? false
      );
    }
    list = this.service.filterByStati(list, filters.stati);
    list = this.service.filterByCategories(list, filters.categories);

    return list;
  }
}

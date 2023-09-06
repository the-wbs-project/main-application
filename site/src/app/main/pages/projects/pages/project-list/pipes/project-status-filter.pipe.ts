import { Pipe, PipeTransform } from '@angular/core';
import { PROJECT_VIEW_STATI_TYPE, Project } from '@wbs/core/models';
import { ProjectService } from '@wbs/core/services';

@Pipe({ name: 'projectStatusFilter', pure: false, standalone: true })
export class ProjectStatusFilterPipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

  transform(
    list: Project[] | null | undefined,
    status: PROJECT_VIEW_STATI_TYPE | string | null | undefined
  ): Project[] | null | undefined {
    if (list == null || list.length === 0 || status == undefined) return list;

    return this.service.filterByStatus(list, status);
  }
}

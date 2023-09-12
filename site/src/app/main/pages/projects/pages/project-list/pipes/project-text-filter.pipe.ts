import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '@wbs/core/models';
import { ProjectService } from '@wbs/core/services';

@Pipe({ name: 'projectTextFilter', pure: false, standalone: true })
export class ProjectTextFilterPipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

  transform(
    list: Project[] | null | undefined,
    text: string | null | undefined
  ): Project[] | null | undefined {
    if (list == null || list.length === 0 || !text || text.trim() === '')
      return list;

    return this.service.filterByName(list, text);
  }
}

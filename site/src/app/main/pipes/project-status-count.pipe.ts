import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '@wbs/core/models';
import { ProjectService } from '@wbs/core/services';

@Pipe({ name: 'projectStatusCount',standalone: true })
export class ProjectStatusCountPipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

  transform([list, status]: [Project[] | null | undefined, string]): number {
    return this.service.filter(list, status).length;
  }
}

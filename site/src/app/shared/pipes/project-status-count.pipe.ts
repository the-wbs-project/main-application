import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '@wbs/shared/services';
import { Project } from '../models';

@Pipe({ name: 'projectStatusCount' })
export class ProjectStatusCountPipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

  transform([list, status]: [Project[] | null | undefined, string]): number {
    return this.service.filter(list, status).length;
  }
}

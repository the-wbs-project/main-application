import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '@wbs/core/services';

@Pipe({ name: 'projectStatus' })
export class ProjectStatusPipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

  transform(status: string): string {
    return this.service.getStatus(status);
  }
}

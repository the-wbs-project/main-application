import { Pipe, PipeTransform } from '@angular/core';
import { ProjectService } from '@wbs/core/services';

@Pipe({ name: 'projectStatus', standalone: true })
export class ProjectStatusPipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

  transform(status: string | undefined): string {
    return this.service.getStatus(status);
  }
}

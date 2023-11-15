import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/core/services';

@Pipe({ name: 'projectApprovalWindowTitle', standalone: true })
export class ProjectApprovalWindowTitlePipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(id: string): string {
    if (id === 'project-title')
      return this.resources.get('Projects.ProjectTitle');
    if (id === 'project-description')
      return this.resources.get('Projects.ProjectDescription');
    if (id === 'project-roles')
      return this.resources.get('Projects.ProjectRoles');

    return this.resources.get('General.Tasks');
  }
}

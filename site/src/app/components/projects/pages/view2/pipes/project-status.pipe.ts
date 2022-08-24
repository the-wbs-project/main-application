import { Pipe, PipeTransform } from '@angular/core';
import { PROJECT_STATI, PROJECT_STATI_TYPE } from '@wbs/shared/models';
import { Resources } from '@wbs/shared/services';

@Pipe({ name: 'projectStatus' })
export class ProjectStatusPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(status: PROJECT_STATI_TYPE): string {
    if (!status) return '';

    if (status === PROJECT_STATI.CLOSED)
      return this.resources.get('General.Closed');
    if (status === PROJECT_STATI.EXECUTION)
      return this.resources.get('General.Execution');
    if (status === PROJECT_STATI.FOLLOW_UP)
      return this.resources.get('General.FollowUp');
    if (status === PROJECT_STATI.PLANNING)
      return this.resources.get('General.Planning');

    return '';
  }
}

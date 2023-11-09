import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { TasksState } from '../../states';

@Pipe({ name: 'projectApprovalWindowTitle', standalone: true })
export class ProjectApprovalWindowTitlePipe implements PipeTransform {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  transform(id: string): string {
    if (id === 'project-title')
      return this.resources.get('Projects.ProjectTitle');
    if (id === 'project-description')
      return this.resources.get('Projects.ProjectDescription');
    if (id === 'project-roles')
      return this.resources.get('Projects.ProjectRoles');

    const taskName = this.store
      .selectSnapshot(TasksState.nodes)
      ?.find((x) => x.id === id)?.title;

    return `${this.resources.get('General.Tasks')} - ${
      taskName ?? 'Unknown Task'
    }`;
  }
}

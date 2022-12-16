import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ProjectState } from '../../../states';
import { PROJECT_PAGE_VIEW, TASK_PAGE_VIEW } from '../models';
import { ProjectViewState } from '../states';

@Injectable()
export class ProjectNavigationService {
  constructor(private readonly store: Store) {}

  private get projectId(): string {
    return this.store.selectSnapshot(ProjectState.current)!.id;
  }

  private get nodeView(): string {
    return this.store.selectSnapshot(ProjectViewState.viewNode)!;
  }

  getProjectNavAction(): any {
    return new Navigate([
      '/projects',
      this.projectId,
      'view',
      this.nodeView == 'phase' ? 'phases' : 'disciplines',
    ]);
  }

  toProject(projectId: string, page = PROJECT_PAGE_VIEW.ABOUT): void {
    this.store.dispatch(
      new Navigate(
        page === PROJECT_PAGE_VIEW.UPLOAD
          ? ['/projects', projectId, page]
          : ['/projects', projectId, 'view', page]
      )
    );
  }

  toProjectPage(page: string): void {
    this.store.dispatch(
      new Navigate(['/projects', this.projectId, 'view', page])
    );
  }

  toTask(taskId: string, page = TASK_PAGE_VIEW.ABOUT): void {
    this.store.dispatch(
      new Navigate([
        'projects',
        this.projectId,
        'view',
        this.nodeView == 'phase' ? 'phases' : 'disciplines',
        'task',
        taskId,
        page,
      ])
    );
  }
}

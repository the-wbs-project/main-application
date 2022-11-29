import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ProjectState } from '../../../states';
import { TASK_PAGE_VIEW } from '../models';

@Injectable()
export class ProjectNavigationService {
  constructor(private readonly store: Store) {}

  private get projectId(): string {
    return this.store.selectSnapshot(ProjectState.current)!.id;
  }

  toProject(projectId: string, page = TASK_PAGE_VIEW.ABOUT): void {
    this.store.dispatch(new Navigate(['/projects', projectId, 'view', page]));
  }

  toProjectPage(page: string): void {
    this.store.dispatch(new Navigate(['/projects', this.projectId, 'view', page]));
  }

  toTask(taskId: string, page = TASK_PAGE_VIEW.ABOUT): void {
    this.store.dispatch(
      new Navigate([
        'projects',
        this.projectId,
        'view',
        'phases',
        'task',
        taskId,
        page,
      ])
    );
  }
}

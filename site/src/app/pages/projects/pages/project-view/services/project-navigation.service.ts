import { inject, Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PROJECT_PAGES } from '../models';
import { ProjectStore } from '../stores';

@Injectable()
export class ProjectNavigationService {
  private readonly projectStore = inject(ProjectStore);
  private readonly store = inject(Store);

  private get owner(): string {
    return this.projectStore.project()!.owner;
  }

  private get projectId(): string {
    return this.projectStore.project()!.id;
  }

  toProject(projectId: string, page = PROJECT_PAGES.ABOUT): void {
    this.store.dispatch(
      new Navigate([...this.urlPrefix(), 'view', projectId, page])
    );
  }

  toProjectPage(...pages: string[]): void {
    this.store.dispatch(
      new Navigate([...this.urlPrefix(), 'view', this.projectId, ...pages])
    );
  }

  toTaskPage(taskId: string, ...pages: string[]): void {
    this.store.dispatch(
      new Navigate([
        ...this.urlPrefix(),
        'view',
        this.projectId,
        'tasks',
        taskId,
        ...pages,
      ])
    );
  }

  private urlPrefix(): string[] {
    return ['/', this.owner, 'projects'];
  }
}

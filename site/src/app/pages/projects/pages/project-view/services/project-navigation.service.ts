import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PROJECT_PAGES } from '../models';
import { ProjectState } from '../states';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Utils } from '@wbs/main/services';

@Injectable()
export class ProjectNavigationService {
  constructor(private readonly store: Store) {}

  private get owner(): string {
    return this.store.selectSnapshot(ProjectState.current)!.owner;
  }

  private get projectId(): string {
    return this.store.selectSnapshot(ProjectState.current)!.id;
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

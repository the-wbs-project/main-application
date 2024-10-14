import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  PROJECT_STATI,
  PROJECT_STATI_TYPE,
  ProjectCategoryChanges,
  ProjectNode,
  User,
} from '@wbs/core/models';
import { Transformers, Utils } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { ProjectViewModel, TaskViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectActivityService } from '../../../services';
import { SetChecklistData } from '../actions';
import { ProjectStore } from '../stores';
import { ProjectTaskService } from './project-task.service';

@Injectable()
export class ProjectService {
  private readonly activity = inject(ProjectActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly metadata = inject(MetadataStore);
  protected readonly projectStore = inject(ProjectStore);
  protected readonly store = inject(Store);
  protected readonly taskService = inject(ProjectTaskService);
  protected readonly transformers = inject(Transformers);

  static getProjectUrl(route: ProjectViewModel): string[];
  static getProjectUrl(route: ActivatedRouteSnapshot): string[];
  static getProjectUrl(
    item: ActivatedRouteSnapshot | ProjectViewModel
  ): string[] {
    if (item instanceof ActivatedRouteSnapshot) {
      return [
        '/',
        Utils.getParam(item, 'org'),
        'projects',
        'view',
        Utils.getParam(item, 'projectId'),
      ];
    } else {
      return ['/', item.owner, 'projects', 'view', item.recordId];
    }
  }

  static getTaskUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      ...ProjectService.getProjectUrl(route),
      'tasks',
      Utils.getParam(route, 'taskId'),
    ];
  }

  static getTaskApiUrl(route: ActivatedRouteSnapshot): string {
    return [
      '/api',
      'portfolio',
      Utils.getParam(route, 'org'),
      'projects',
      Utils.getParam(route, 'projectId'),
      'nodes',
      Utils.getParam(route, 'taskId'),
    ].join('/');
  }

  getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const definition = this.metadata.roles.definitions.find(
      (x) => x.id === role
    )!;

    return useAbbreviations ? definition.abbreviation : definition.description;
  }

  getPhaseIds(nodes: ProjectNode[] | TaskViewModel[]): string[] {
    return nodes.filter((x) => x.parentId == null).map((x) => x.id);
  }

  changeTitle(title: string): Observable<void> {
    const project = this.projectStore.project()!;
    const from = project.title;

    project.title = title;

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.changeProjectTitle(project.owner, project.id, from, title)
      )
    );
  }

  changeProjectDescription(description: string): Observable<void> {
    const project = this.projectStore.project()!;
    const from = project.description;

    project.description = description;

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.changeProjectDescription(
          project.owner,
          project.id,
          from,
          description
        )
      )
    );
  }

  changeProjectCategory(category: string): Observable<void> {
    const project = this.projectStore.project()!;
    const from = project.category;

    project.category = category;

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.changeProjectCategory(
          project.owner,
          project.id,
          from,
          category
        )
      )
    );
  }

  changeProjectStatus(status: PROJECT_STATI_TYPE): Observable<void> {
    const project = this.projectStore.project()!;
    const original = project.status;

    project.status = status;

    if (status === PROJECT_STATI.APPROVAL) {
      //
      //  If the status is approval, set to true.  If its not true leave it alone (don't set to false).
      //
      project.approvalStarted = true;
    }

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.changeProjectStatus(
          project.owner,
          project.id,
          original,
          status
        )
      )
    );
  }

  cancelProject(): Observable<void> {
    const project = this.projectStore.project()!;

    project.status = PROJECT_STATI.CANCELLED;

    return this.data.projects
      .deleteProjectAsync(project.owner, project.id)
      .pipe(
        tap(() => this.projectStore.setProject(project)),
        switchMap(() => this.activity.cancelProject(project.owner, project.id))
      );
  }

  changeProjectDisciplines(changes: ProjectCategoryChanges): Observable<void> {
    const project = this.projectStore.project()!;
    const original = [...project.disciplines];

    project.disciplines = changes.categories;

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.changeProjectDisciplines(
          project.owner,
          project.id,
          original.map((x) => x.id),
          project.disciplines.map((x) => x.id)
        )
      ),
      tap(() =>
        changes.removedIds.length == 0
          ? of('')
          : this.taskService.removeDisciplinesFromTasks(changes.removedIds)
      )
    );
  }

  addUserToRole(role: string, user: User): Observable<void> {
    const project = this.projectStore.project()!;

    project.roles.push({ role, user });

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.addUserToRole(
          project.owner,
          project.id,
          user,
          this.getRoleTitle(role, false)
        )
      )
    );
  }

  removeUserFromRole(role: string, user: User): Observable<unknown> {
    const project = this.projectStore.project()!;
    const index = project.roles.findIndex(
      (x) => x.role === role && x.user.userId === user.userId
    );

    if (index === -1) return of('');

    project.roles.splice(index, 1);

    return this.saveProject(project).pipe(
      switchMap(() =>
        this.activity.removeUserToRole(
          project.owner,
          project.id,
          user,
          this.getRoleTitle(role, false)
        )
      )
    );
  }

  private saveProject(project: ProjectViewModel): Observable<void> {
    const model = this.transformers.projects.toModel(project);

    return this.data.projects.putProjectAsync(model).pipe(
      tap(() => this.projectStore.markProject(project)),
      tap(() =>
        this.store.dispatch(new SetChecklistData(project, undefined, undefined))
      )
    );
  }
}

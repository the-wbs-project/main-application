import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/main/services';
import { first, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { ProjectState, TasksState } from '../states';
import { Observable, of } from 'rxjs';
import { Project, ProjectNode } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export const projectClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getProjectClaims(inject(DataServiceFactory), inject(Store), route);

export const projectIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getProjectId(inject(Store), route);

export const taskIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getTaskId(inject(Store), route);

export const projectUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getProjectUrl(inject(Store), route);

function getProject(store: Store): Observable<Project> {
  return store.select(ProjectState.current).pipe(
    skipWhile((x) => x == undefined),
    map((x) => x!),
    first()
  );
}

function getTask(store: Store): Observable<WbsNodeView> {
  return store.select(TasksState.current).pipe(
    skipWhile((x) => x == undefined),
    map((x) => x!),
    first()
  );
}

function getProjectId(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string> {
  const projectId = route.params['projectId'];

  return projectId
    ? of(projectId)
    : getProject(store).pipe(
        map((x) => x!.id),
        first()
      );
}

function getTaskId(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string> {
  const taskId = route.params['taskId'];

  return taskId ? of(taskId) : getTask(store).pipe(map((x) => x!.id));
}

function getProjectClaims(
  data: DataServiceFactory,
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return getProjectId(store, route).pipe(
    switchMap((projectId) =>
      data.claims.getProjectClaimsAsync(Utils.getParam(route, 'org'), projectId)
    )
  );
}

function getProjectUrl(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return getProjectId(store, route).pipe(
    map((projectId) => [
      './' + Utils.getParam(route, 'org'),
      'projects',
      'view',
      projectId,
    ])
  );
}

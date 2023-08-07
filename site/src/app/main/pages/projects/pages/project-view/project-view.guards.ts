import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LoadDiscussionForum, VerifyTimelineData } from '@wbs/main/actions';
import { MembershipState } from '@wbs/main/states';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  InitiateChecklist,
  LoadProjectTimeline,
  LoadTaskTimeline,
  ProjectPageChanged,
  TaskPageChanged,
  VerifyProject,
  VerifyTask,
} from './actions';
import { PROJECT_PAGE_VIEW } from './models';
import { ProjectState, ProjectViewState } from './states';

export const projectDiscussionGuard = () => {
  const store = inject(Store);

  return forkJoin({
    org: store.selectOnce(MembershipState.id),
    project: store.selectOnce(ProjectState.current),
  }).pipe(
    switchMap((data) =>
      store.dispatch(new LoadDiscussionForum(data.org!, data.project!.id))
    ),
    map(() => true)
  );
};
export const projectRedirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(
      new Navigate([
        'projects',
        'view',
        route.params['projectId'],
        PROJECT_PAGE_VIEW.ABOUT,
      ])
    )
    .pipe(map(() => true));
};

export const projectTimelineVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const id = route.params['projectId'];

  return store
    .dispatch([new VerifyTimelineData(), new LoadProjectTimeline(id)])
    .pipe(map(() => true));
};

export const projectVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch([
      new InitiateChecklist(),
      new VerifyProject(route.params['owner'], route.params['projectId']),
    ])
    .pipe(map(() => true));
};

export const projectViewGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const view = route.data['view'];

  return store.dispatch(new ProjectPageChanged(view)).pipe(map(() => true));
};

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const viewNode = store.selectSnapshot(ProjectViewState.viewNode)!;
  const taskId = route.params['taskId'];

  if (!taskId) return false;

  return store
    .dispatch([new VerifyTask(viewNode, taskId), new LoadTaskTimeline(taskId)])
    .pipe(map(() => true));
};

export const taskViewGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const view = route.data['view'];

  return store.dispatch(new TaskPageChanged(view)).pipe(map(() => true));
};

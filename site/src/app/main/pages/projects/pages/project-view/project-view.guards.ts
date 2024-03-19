import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LoadDiscussionForum, SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  InitiateChecklist,
  SetApproval,
  SetApprovalView,
  VerifyProject,
  VerifyTask,
  VerifyTasks,
} from './actions';
import { PROJECT_PAGES } from './models';
import { ProjectState } from './states';

export const closeApprovalWindowGuard = () =>
  inject(Store)
    .dispatch(new SetApproval())
    .pipe(map(() => true));

export const projectDiscussionGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getParam(route, 'org');

  return store
    .dispatch(new LoadDiscussionForum(owner, route.params['projectId']))
    .pipe(map(() => true));
};

export const projectRedirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getParam(route, 'org');

  return store
    .dispatch(
      new Navigate([
        owner,
        'projects',
        'view',
        route.params['projectId'],
        PROJECT_PAGES.ABOUT,
      ])
    )
    .pipe(map(() => true));
};

export const projectVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getParam(route, 'org');

  if (!owner) return false;

  return store
    .dispatch([
      new InitiateChecklist(),
      new VerifyProject(owner, route.params['projectId']),
    ])
    .pipe(
      switchMap(() => store.selectOnce(ProjectState.current)),
      switchMap((project) => {
        if (!project) return of(false);

        return store
          .dispatch([
            new VerifyTasks(project, true),
            new SetBreadcrumbs([
              {
                route: ['/', owner, 'projects'],
                text: 'General.Projects',
              },
              {
                text: project.title,
                isText: true,
              },
            ]),
          ])
          .pipe(map(() => true));
      })
    );
};

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const taskId = route.params['taskId'];

  if (!taskId) return false;

  return store.dispatch([new VerifyTask(taskId)]).pipe(map(() => true));
};

export const setApprovalViewAsTask = () =>
  inject(Store)
    .dispatch(new SetApprovalView('task'))
    .pipe(map(() => true));

export const setApprovalViewAsProject = () =>
  inject(Store)
    .dispatch(new SetApprovalView('project'))
    .pipe(map(() => true));

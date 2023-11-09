import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LoadDiscussionForum, SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  InitiateChecklist,
  ProjectPageChanged,
  SetApproval,
  VerifyProject,
  VerifyTask,
} from './actions';
import { PROJECT_PAGES } from './models';
import { ProjectState, ProjectViewState } from './states';

export const closeApprovalWindowGuard = () =>
  inject(Store)
    .dispatch(new SetApproval())
    .pipe(map(() => true));

export const projectDiscussionGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

  return store
    .dispatch(new LoadDiscussionForum(owner, route.params['projectId']))
    .pipe(map(() => true));
};

export const projectRedirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

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
  const owner = Utils.getOrgName(store, route);

  if (!owner) return false;

  return store
    .dispatch([
      new InitiateChecklist(),
      new VerifyProject(owner, route.params['projectId']),
    ])
    .pipe(
      switchMap(() => store.selectOnce(ProjectState.current)),
      tap((project) =>
        store.dispatch(
          new SetBreadcrumbs([
            {
              route: ['/', owner, 'projects'],
              text: 'General.Projects',
            },
            {
              text: project!.title,
              isText: true,
            },
          ])
        )
      ),
      map(() => true)
    );
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
    .dispatch([new VerifyTask(viewNode, taskId)])
    .pipe(map(() => true));
};

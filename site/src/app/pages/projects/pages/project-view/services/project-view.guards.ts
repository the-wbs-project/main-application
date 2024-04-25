import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { LoadDiscussionForum, SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  InitiateChecklist,
  SetApproval,
  SetApprovalView,
  SetProjectNavSection,
  SetTaskNavSection,
  VerifyProject,
  VerifyTask,
  VerifyTasks,
} from '../actions';
import { ProjectState } from '../states';
import { ProjectService } from './project.service';

export const closeApprovalWindowGuard = () =>
  inject(Store).dispatch(new SetApproval());

export const projectDiscussionGuard = (route: ActivatedRouteSnapshot) => {
  return inject(Store).dispatch(
    new LoadDiscussionForum(
      Utils.getParam(route, 'org'),
      Utils.getParam(route, 'projectId')
    )
  );
};

export const projectVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  inject(TitleService).setTitle('Pages.Projects', true);

  return store
    .dispatch([
      new InitiateChecklist(),
      new VerifyProject(
        Utils.getParam(route, 'org'),
        Utils.getParam(route, 'projectId')
      ),
    ])
    .pipe(
      switchMap(() => store.selectOnce(ProjectState.current)),
      switchMap((project) => {
        if (!project) return of(false);

        return store.dispatch(new VerifyTasks(project, true));
      })
    );
};

export const projectNavGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const service = inject(ProjectService);
  const section = route.data['navSection'];

  store.dispatch(new SetProjectNavSection(section));

  if (!route.data['crumbs']) return;

  return service.getProjectBreadcrumbs(route).pipe(
    switchMap((crumbs) => {
      crumbs.at(-1)!.route = undefined;

      return store.dispatch(new SetBreadcrumbs(crumbs));
    })
  );
};

export const taskNavGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const service = inject(ProjectService);
  const section = route.data['navSection'];
  const crumbSections = route.data['crumbs'];

  store.dispatch(new SetTaskNavSection(section));

  if (!crumbSections) return;

  if (!route.data['crumbs']) return;

  return service.getTaskBreadcrumbs(route).pipe(
    switchMap((crumbs) => {
      crumbs.at(-1)!.route = undefined;

      return store.dispatch(new SetBreadcrumbs(crumbs));
    })
  );
};

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const taskId = Utils.getParam(route, 'taskId');

  if (!taskId) return false;

  return store.dispatch([new VerifyTask(taskId)]);
};

export const setApprovalViewAsTask = () =>
  inject(Store).dispatch(new SetApprovalView('task'));

export const setApprovalViewAsProject = () =>
  inject(Store).dispatch(new SetApprovalView('project'));

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { Utils } from '@wbs/core/services';
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
import { ProjectBreadcrumbsService } from './project-breadcrumbs.service';

export const closeApprovalWindowGuard = () =>
  inject(Store).dispatch(new SetApproval());

export const projectVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  inject(TitleService).setTitle([{ text: 'Pages.Projects' }]);

  return store
    .dispatch([
      new InitiateChecklist(),
      new VerifyProject(
        Utils.getParam(route, 'org'),
        Utils.getParam(route, 'projectId')
      ),
    ])
    .pipe(switchMap(() => store.dispatch(new VerifyTasks(true))));
};

export const projectNavGuard = (route: ActivatedRouteSnapshot) => {
  inject(Store).dispatch(new SetProjectNavSection(route.data['navSection']));

  if (!route.data['crumbs']) return;

  inject(ProjectBreadcrumbsService).setProjectCrumbs(route);
};

export const taskNavGuard = (route: ActivatedRouteSnapshot) => {
  inject(Store).dispatch(new SetTaskNavSection(route.data['navSection']));
  //
  //  At the moment breadcrumbs aren't being shown in the task dialog, so don't call
  //
  //if (!route.data['crumbs']) return;
  //inject(ProjectBreadcrumbsService).setTaskCrumbs(route);
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

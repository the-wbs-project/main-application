import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { Utils } from '@wbs/main/services';
import { UiStore } from '@wbs/store';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  const uiStore = inject(UiStore);

  store.dispatch(new SetProjectNavSection(section));

  if (!route.data['crumbs']) return;

  return service.getProjectBreadcrumbs(route).pipe(
    map((crumbs) => {
      crumbs.at(-1)!.route = undefined;

      uiStore.setBreadcrumbs(crumbs);
    })
  );
};

export const taskNavGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const service = inject(ProjectService);
  const uiStore = inject(UiStore);
  const section = route.data['navSection'];
  const crumbSections = route.data['crumbs'];

  store.dispatch(new SetTaskNavSection(section));

  if (!crumbSections) return;

  if (!route.data['crumbs']) return;

  return service.getTaskBreadcrumbs(route).pipe(
    map((crumbs) => {
      crumbs.at(-1)!.route = undefined;

      uiStore.setBreadcrumbs(crumbs);
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

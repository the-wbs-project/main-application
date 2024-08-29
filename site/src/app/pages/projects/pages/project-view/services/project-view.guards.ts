import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { TitleService, Utils } from '@wbs/core/services';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InitiateChecklist, SetApproval, SetApprovalView } from '../actions';
import { ProjectStore } from '../stores';

export const closeApprovalWindowGuard = () =>
  inject(Store).dispatch(new SetApproval());

export const projectVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const projectStore = inject(ProjectStore);
  const store = inject(Store);
  const owner = Utils.getParam(route, 'org');
  const projectId = Utils.getParam(route, 'projectId');

  if (!owner || !projectId) return false;

  inject(TitleService).setTitle([{ text: 'General.Projects' }]);

  return forkJoin({
    project: data.projects.getAsync(owner, projectId),
    tasks: data.projectNodes.getAllAsync(owner, projectId),
    claims: data.claims.getProjectClaimsAsync(owner, projectId),
  }).pipe(
    switchMap(({ project, tasks, claims }) => {
      projectStore.setAll(project, tasks, claims);

      return store.dispatch([new InitiateChecklist()]);
    })
  );
};

export const setApprovalViewAsTask = () =>
  inject(Store).dispatch(new SetApprovalView('task'));

export const setApprovalViewAsProject = () =>
  inject(Store).dispatch(new SetApprovalView('project'));

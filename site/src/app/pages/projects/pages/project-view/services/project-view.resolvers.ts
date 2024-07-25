import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Utils } from '@wbs/core/services';
import { ProjectService } from './project.service';
import { ProjectApprovalState } from '../states';
import { Store } from '@ngxs/store';
import { APP_CONFIG_TOKEN } from '@wbs/core/models';

export const projectIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'projectId');

export const taskIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'taskId');

export const projectUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getProjectUrl(route);

export const projectApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getProjectApiUrl(inject(APP_CONFIG_TOKEN), route);

export const taskApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getTaskApiUrl(inject(APP_CONFIG_TOKEN), route);

export const approvalEnabledResolve: ResolveFn<boolean> = () =>
  inject(Store).select(ProjectApprovalState.enabled);

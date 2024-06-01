import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { ProjectService } from './project.service';
import { ProjectApprovalState } from '../states';
import { Store } from '@ngxs/store';

export const projectClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getProjectClaims(inject(DataServiceFactory), route);

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
) => ProjectService.getProjectApiUrl(route);

export const taskApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getTaskApiUrl(route);

export const approvalEnabledResolve: ResolveFn<boolean> = () =>
  inject(Store).select(ProjectApprovalState.enabled);

function getProjectClaims(
  data: DataServiceFactory,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return data.claims.getProjectClaimsAsync(
    Utils.getParam(route, 'org'),
    Utils.getParam(route, 'projectId')
  );
}

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProjectApprovalState } from '../states';
import { ProjectService } from './project.service';

export const projectUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getProjectUrl(route);

export const projectApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getProjectApiUrl(route);

export const approvalEnabledResolve: ResolveFn<boolean> = () =>
  inject(Store).select(ProjectApprovalState.enabled);

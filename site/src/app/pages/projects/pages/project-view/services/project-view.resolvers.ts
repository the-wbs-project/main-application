import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ProjectService } from './project.service';

export const projectUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getProjectUrl(route);

export const projectApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => ProjectService.getProjectApiUrl(route);

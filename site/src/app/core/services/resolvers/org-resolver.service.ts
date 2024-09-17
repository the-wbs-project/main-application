import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Utils } from '../utils.service';

export const orgResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot) =>
  Utils.getParam(route, 'org');

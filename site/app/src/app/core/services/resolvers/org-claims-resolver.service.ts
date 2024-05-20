import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '../utils.service';

export const orgClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => {
  return inject(DataServiceFactory).claims.getOrganizationClaimsAsync(
    Utils.getParam(route, 'org')
  );
};

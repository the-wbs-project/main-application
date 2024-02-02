import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '../utils.service';

export const orgClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => {
  return inject(DataServiceFactory).claims.getOrganizationClaimsAsync(
    Utils.getOrgName(inject(Store), route)
  );
};

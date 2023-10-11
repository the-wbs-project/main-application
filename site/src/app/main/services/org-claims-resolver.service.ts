import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { MembershipState } from '@wbs/main/states';

export const orgClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => {
  const org =
    route.params['org'] ??
    route.params['owner'] ??
    inject(Store).selectSnapshot(MembershipState.organization)?.name;

  return inject(DataServiceFactory).claims.getOrganizationClaimsAsync(org);
};

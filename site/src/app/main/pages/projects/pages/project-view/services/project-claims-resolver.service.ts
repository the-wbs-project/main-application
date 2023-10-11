import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { MembershipState } from '@wbs/main/states';
import { ProjectState } from '../states';

export const projectClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => {
  const org =
    route.params['org'] ??
    route.params['owner'] ??
    inject(Store).selectSnapshot(MembershipState.organization)?.name;
  const projectId =
    route.params['projectId'] ??
    inject(Store).selectSnapshot(ProjectState.current)?.id;

  return inject(DataServiceFactory).claims.getProjectClaimsAsync(
    org,
    projectId
  );
};

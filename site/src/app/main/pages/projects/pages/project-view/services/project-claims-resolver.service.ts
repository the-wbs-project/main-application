import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/main/services';
import { ProjectState } from '../states';

export const projectClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);
  const projectId =
    route.params['projectId'] ?? store.selectSnapshot(ProjectState.current)?.id;

  return inject(DataServiceFactory).claims.getProjectClaimsAsync(
    owner,
    projectId
  );
};

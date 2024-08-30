import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { UserViewModel } from '@wbs/core/view-models';
import { Utils } from '../utils.service';

export const orgMemberResolve: ResolveFn<UserViewModel[]> = (
  route: ActivatedRouteSnapshot
) =>
  inject(DataServiceFactory).memberships.getMembershipUsersAsync(
    Utils.getParam(route, 'org')
  );

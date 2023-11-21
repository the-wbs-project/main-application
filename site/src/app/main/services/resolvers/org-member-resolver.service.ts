import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member } from '@wbs/core/models';
import { Utils } from '../utils.service';

export const orgMemberResolve: ResolveFn<Member[]> = (
  route: ActivatedRouteSnapshot
) =>
  inject(DataServiceFactory).memberships.getMembershipUsersAsync(
    Utils.getOrgName(inject(Store), route)
  );

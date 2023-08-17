import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';

export const orgResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot) =>
  route.params['org'] ??
  inject(Store).selectSnapshot(MembershipState.organization)?.name;

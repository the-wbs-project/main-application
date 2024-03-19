import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Organization } from '@wbs/core/models';
import { MembershipState } from '@wbs/main/states';
import { first, map, skipWhile } from 'rxjs/operators';
import { Utils } from '../utils.service';

export const orgResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot) =>
  Utils.getParam(route, 'org');

export const orgObjResolve: ResolveFn<Organization> = () =>
  inject(Store)
    .select(MembershipState.organization)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!),
      first()
    );

export const orgListResolve: ResolveFn<Organization[]> = () =>
  inject(Store)
    .select(MembershipState.organizations)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x ?? []),
      first()
    );

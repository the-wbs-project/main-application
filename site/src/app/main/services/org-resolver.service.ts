import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Organization } from '@wbs/core/models';
import { MembershipState } from '@wbs/main/states';
import { first, map, skipWhile, tap } from 'rxjs/operators';

export const orgResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot) =>
  route.params['org'] ??
  inject(Store).selectSnapshot(MembershipState.organization)?.name;

export const orgObjResolve: ResolveFn<Organization> = () =>
  inject(Store)
    .select(MembershipState.organization)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!),
      tap((x) => console.log('org', x)),
      first()
    );

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { User } from '@wbs/core/models';
import { AuthState, MembershipState } from '@wbs/main/states';
import { first, map, skipWhile, tap } from 'rxjs/operators';

export const userResolve: ResolveFn<User> = () =>
  inject(Store)
    .select(AuthState.profile)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!),
      first()
    );

export const rolesResolve: ResolveFn<string[]> = () =>
  inject(Store)
    .select(MembershipState.roles)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!),
      first()
    );

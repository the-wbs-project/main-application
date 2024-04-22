import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';
import { first, map, skipWhile } from 'rxjs/operators';

export const rolesResolve: ResolveFn<string[]> = () =>
  inject(Store)
    .select(MembershipState.roles)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!),
      first()
    );

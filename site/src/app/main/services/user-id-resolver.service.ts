import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/main/states';
import { map } from 'rxjs/operators';

export const userIdResolve: ResolveFn<string> = () =>
  inject(Store)
    .selectOnce(AuthState.userId)
    .pipe(map((x) => x!));

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserStore } from '@wbs/core/store';

export const userIdResolve: ResolveFn<string> = () =>
  inject(UserStore).userId()!;

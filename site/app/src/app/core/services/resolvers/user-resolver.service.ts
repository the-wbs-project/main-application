import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MembershipStore, UserStore } from '@wbs/store';

export const userIdResolve: ResolveFn<string> = () =>
  inject(UserStore).userId()!;

export const rolesResolve: ResolveFn<string[]> = () =>
  inject(MembershipStore).roles()!;

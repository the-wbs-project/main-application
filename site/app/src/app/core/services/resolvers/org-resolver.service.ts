import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Organization } from '@wbs/core/models';
import { MembershipStore } from '@wbs/store';
import { Utils } from '../utils.service';

export const orgResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot) =>
  Utils.getParam(route, 'org');

export const orgObjResolve: ResolveFn<Organization> = () =>
  inject(MembershipStore).organization()!;

export const orgListResolve: ResolveFn<Organization[]> = () =>
  inject(MembershipStore).organizations()!;

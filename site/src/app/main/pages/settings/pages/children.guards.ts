import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { RefreshMembers } from '@wbs/main/actions';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs/operators';
import { LoadInvitations } from './members/actions';

export const verifyInvitationsLoaded = (route: ActivatedRouteSnapshot) => {
  const org =
    route.params['org'] ??
    inject(Store).selectSnapshot(MembershipState.organization)?.name;

  return inject(Store)
    .dispatch(new LoadInvitations(org))
    .pipe(map(() => true));
};

export const refreshMembers = () => {
  return inject(Store)
    .dispatch(new RefreshMembers())
    .pipe(map(() => true));
};

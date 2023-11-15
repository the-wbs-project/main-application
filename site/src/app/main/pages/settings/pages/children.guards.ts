import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/main/services';
import { map } from 'rxjs/operators';
import { LoadInvitations } from './members/actions';

export const verifyInvitationsLoaded = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const org = Utils.getOrgName(store, route);

  return store.dispatch(new LoadInvitations(org)).pipe(map(() => true));
};

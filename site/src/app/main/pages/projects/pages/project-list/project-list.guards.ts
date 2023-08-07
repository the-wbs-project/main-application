import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { HeaderInformation } from '@wbs/core/models';
import { SetHeaderInfo } from '@wbs/main/actions';
import { map } from 'rxjs/operators';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(
      new Navigate(['/projects', 'list', route.params['type'], 'active'])
    )
    .pipe(map(() => true));
};

export const headerGuard = (info: HeaderInformation) => {
  const store = inject(Store);

  return store.dispatch(new SetHeaderInfo(info)).pipe(map(() => true));
};

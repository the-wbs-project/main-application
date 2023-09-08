import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadInvitations } from '@wbs/main/actions';
import { map } from 'rxjs/operators';

export const verifyInvitationsLoaded = () =>
  inject(Store)
    .dispatch(new LoadInvitations())
    .pipe(map(() => true));

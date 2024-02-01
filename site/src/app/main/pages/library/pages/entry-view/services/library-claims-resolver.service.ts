import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/main/services';
import { EntryViewState } from '../states';

export const libraryClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);
  const entryId =
    route.params['entryId'] ?? store.selectSnapshot(EntryViewState.entry)?.id;

  return inject(DataServiceFactory).claims.getLibraryEntryClaimsAsync(
    owner,
    entryId
  );
};

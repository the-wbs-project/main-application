import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ResourceRecord } from '@wbs/core/models';
import { Utils } from '@wbs/main/services';
import { EntryViewState } from '../states';

export const entryResourceResolve: ResolveFn<ResourceRecord[]> = (
  route: ActivatedRouteSnapshot
) => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);
  const owner = Utils.getOrgName(store, route);
  const version = 1;
  const entryId =
    route.params['entryId'] ??
    inject(Store).selectSnapshot(EntryViewState.entry)?.id;

  return data.libraryEntryResources.getAsync(owner, entryId, version);
};

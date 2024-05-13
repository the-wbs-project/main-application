import { inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { UserStore } from '@wbs/core/store';
import { map } from 'rxjs/operators';

export const watcherGuard = () => {
  const store = inject(UserStore);

  return inject(DataServiceFactory)
    .libraryEntryWatchers.getEntriesAsync(store.userId()!)
    .pipe(
      map((list) => {
        store.watchers.library.set(list);
      })
    );
};

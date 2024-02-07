import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryNode } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EntryViewState } from '../states';
import { TasksChanged } from '../actions';

@Injectable()
export class EntryTaskService {
  private readonly data = inject(DataServiceFactory);
  private readonly messaging = inject(Messages);
  private readonly store = inject(Store);

  saveAsync(
    upserts: LibraryEntryNode[],
    removeIds: string[],
    saveMessage: string | undefined
  ): Observable<void> {
    const entry = this.store.selectSnapshot(EntryViewState.entry)!;
    const version = this.store.selectSnapshot(EntryViewState.version)!;

    return this.data.libraryEntryNodes
      .putAsync(entry.owner, entry.id, version.version, upserts, removeIds)
      .pipe(
        tap(() => {
          if (saveMessage) this.messaging.notify.success(saveMessage, false);
        }),
        tap(() => this.store.dispatch(new TasksChanged(upserts, removeIds)))
      );
  }
}

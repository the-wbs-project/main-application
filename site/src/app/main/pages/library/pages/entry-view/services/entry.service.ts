import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { VersionChanged } from '../actions';
import { EntryViewState } from '../states';
import { EntryActivityService } from './entry-activity.service';

@Injectable()
export class EntryService {
  private readonly activity = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly store = inject(Store);

  private get entry(): LibraryEntry {
    return this.store.selectSnapshot(EntryViewState.entry)!;
  }

  private get version(): LibraryEntryVersion {
    return this.store.selectSnapshot(EntryViewState.version)!;
  }

  titleChangedAsync(title: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);
    const from = version.title;

    version.title = title;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messages.notify.success('Library.TitleChanged')),
      switchMap(() => this.store.dispatch(new VersionChanged(version))),
      switchMap(() =>
        this.activity.entryTitleChanged(entry.id, version.version, from, title)
      )
    );
  }

  descriptionChangedAsync(description: string): Observable<void> {
    const entry = this.entry;
    const version = structuredClone(this.version);
    const from = version.description;

    version.description = description;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messages.notify.success('Library.DescriptionChanged')),
      switchMap(() => this.store.dispatch(new VersionChanged(version))),
      switchMap(() =>
        this.activity.entryTitleChanged(
          entry.id,
          version.version,
          from,
          description
        )
      )
    );
  }
}

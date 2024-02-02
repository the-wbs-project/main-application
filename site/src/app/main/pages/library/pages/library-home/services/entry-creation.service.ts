import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { DialogService } from '@wbs/main/services';
import { AuthState } from '@wbs/main/states';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EntryCreationDialogComponent } from '../components/entry-creation-dialog';
import { EntryCreationModel } from '../models';

@Injectable()
export class EntryCreationService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly dialog: DialogService,
    private readonly store: Store
  ) {}

  start(owner: string): void {
    this.dialog
      .openDialog<EntryCreationModel>(EntryCreationDialogComponent, {
        size: 'xl',
        fullscreen: 'sm',
        scrollable: true,
      })
      .pipe(
        switchMap(({ title, type, visibility, nav }) => {
          const entry: LibraryEntry = {
            id: IdService.generate(),
            author: this.store.selectSnapshot(AuthState.userId)!,
            owner,
            type,
            visibility,
          };
          const version: LibraryEntryVersion = {
            entryId: entry.id,
            version: 1,
            categories: [],
            disciplines: [],
            phases: [],
            status: 'draft',
            title,
            lastModified: new Date(),
          };

          return this.data.libraryEntries.putAsync(entry).pipe(
            switchMap(() =>
              this.data.libraryEntryVersions.putAsync(owner, version)
            ),
            tap(() =>
              nav
                ? this.store.dispatch(
                    new Navigate(['/' + owner, 'library', 'view', entry.id])
                  )
                : of()
            )
          );
        })
      )
      .subscribe();
  }
}

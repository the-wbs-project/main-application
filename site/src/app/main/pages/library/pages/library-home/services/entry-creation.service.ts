import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Resources } from '@wbs/core/services';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { EntryTaskCreationComponent } from '../components/entry-task-creation';
import { EntryCreationModel } from '../models';

@Injectable()
export class EntryCreationService {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly resources = inject(Resources);
  private readonly store = inject(Store);

  runAsync(
    owner: string,
    type: string
  ): Observable<LibraryEntryViewModel | void> {
    const dialogRef = this.dialog.open({
      content: EntryTaskCreationComponent,
    });

    //(<CreationDialogComponent>dialogRef.content.instance).type.set(type);

    return dialogRef.result.pipe(
      filter((x) => !(x instanceof DialogCloseResult)),
      map((x) => <EntryCreationModel>x),
      tap((x) => console.log(x)),
      switchMap((results: EntryCreationModel) => {
        return of();
        /* const entry: LibraryEntry = {
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
                    new Navigate([
                      '/' + owner,
                      'library',
                      'view',
                      entry.id,
                      version.version,
                    ])
                  )
                : of(<LibraryEntryViewModel>{
                    author: entry.author,
                    description: version.description,
                    entryId: entry.id,
                    lastModified: version.lastModified,
                    ownerId: entry.owner,
                    status: version.status,
                    title: version.title,
                    type: entry.type,
                    visibility: entry.visibility,
                  })
            )
          );*/
      })
    );
  }
}

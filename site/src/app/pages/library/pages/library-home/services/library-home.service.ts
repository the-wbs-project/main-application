import { Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LibraryListComponent } from '@wbs/components/library/list';
import { Storage } from '@wbs/core/services';
import { MembershipStore, UserStore } from '@wbs/core/store';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { EntryCreationService } from '@wbs/pages/library/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LibraryHomeService {
  private readonly storage = inject(Storage);
  private readonly store = inject(Store);
  private readonly membership = inject(MembershipStore).membership;
  private readonly profile = inject(UserStore).profile;
  private readonly creation = inject(EntryCreationService);

  get selectedLibrary(): string {
    return this.storage.local.get('selectedLibrary') || 'organizational';
  }

  set selectedLibrary(library: string) {
    this.storage.local.set('selectedLibrary', library);
  }

  createEntry(type: string): Observable<LibraryEntryViewModel | undefined> {
    return this.creation.runAsync(this.membership()!.name, type).pipe(
      map((results) => {
        if (results == undefined) return undefined;

        const vm: LibraryEntryViewModel = {
          authorId: results.entry.author,
          authorName: this.profile()!.name,
          entryId: results.entry.id,
          title: results.version.title,
          type: results.entry.type,
          visibility: results.entry.visibility,
          version: results.version.version,
          lastModified: results.version.lastModified,
          description: results.version.description,
          ownerId: results.entry.owner,
          ownerName: this.membership()!.displayName,
          status: results.version.status,
        };
        if (results.action === 'close') return vm;

        this.navigate(vm, results.action);

        return undefined;
      })
    );
  }

  libraryChanged(library: string): void {
    const parts = [library];

    this.store.dispatch(
      new Navigate(['/' + this.membership()!.name, 'library', 'home', ...parts])
    );
  }

  navigate(vm: LibraryEntryViewModel | undefined, action?: string): void {
    if (!vm) return;

    this.store.dispatch(
      new Navigate([
        '/' + this.membership()!.name,
        'library',
        'view',
        vm.ownerId,
        vm.entryId,
        vm.version,
        ...(action === 'upload' ? [action] : []), // Don't send the view since 'view' should actually go to 'about'
      ])
    );
  }
}

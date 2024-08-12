import { Injectable, Signal, inject, signal } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Storage } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';
import { LibraryDraftViewModel, LibraryViewModel } from '@wbs/core/view-models';
import { EntryCreationService } from '@wbs/pages/library/services';

@Injectable()
export class LibraryHomeService {
  private readonly storage = inject(Storage);
  private readonly store = inject(Store);
  private readonly membership = inject(MembershipStore).membership;
  private readonly creation = inject(EntryCreationService);
  private readonly _library = signal<string>(this.getLibraryFromStorage());

  get library(): Signal<string> {
    return this._library;
  }

  setLibrary(library: string): void {
    this._library.set(library);
    this.setLibraryInStorage(library);
  }

  private getLibraryFromStorage(): string {
    return this.storage.local.get('selectedLibrary') || 'drafts';
  }

  private setLibraryInStorage(library: string) {
    this.storage.local.set('selectedLibrary', library);
  }

  createDraft(type: string): void {
    this.creation.runAsync(this.membership()!.name, type).subscribe((data) => {
      if (!data) return;

      this.navigate(data.entry.owner, data.entry.id, data.version.version);
    });
  }

  libraryChanged(library: string): void {
    const parts = [library];

    this.store.dispatch(
      new Navigate(['/' + this.membership()!.name, 'library', 'home', ...parts])
    );
  }

  navigateToVm(vm: LibraryViewModel | LibraryDraftViewModel | undefined): void {
    if (!vm) return;
    this.navigate(vm.ownerId, vm.entryId, vm.version);
  }

  navigate(owner: string, entryId: string, version: number): void {
    this.store.dispatch(
      new Navigate([
        '/' + this.membership()!.name,
        'library',
        'view',
        owner,
        entryId,
        version,
      ])
    );
  }
}

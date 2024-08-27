import { Injectable, Signal, inject, signal } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { EntryPhaseCreationComponent } from '@wbs/components/entry-creation/phase';
import { EntryProjectCreationComponent } from '@wbs/components/entry-creation/project';
import { EntryTaskCreationComponent } from '@wbs/components/entry-creation/task';
import { Storage } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';
import { LibraryDraftViewModel, LibraryViewModel } from '@wbs/core/view-models';

@Injectable()
export class LibraryHomeService {
  private readonly dialog = inject(DialogService);
  private readonly storage = inject(Storage);
  private readonly store = inject(Store);
  private readonly membership = inject(MembershipStore).membership;
  private readonly _library = signal<string>(this.getLibraryFromStorage());
  readonly filtersExpanded = signal(false);

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
    this.dialog.open({
      content:
        type === 'task'
          ? EntryTaskCreationComponent
          : type === 'phase'
          ? EntryPhaseCreationComponent
          : EntryProjectCreationComponent,
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

    this.store.dispatch(
      new Navigate([
        '/' + this.membership()!.name,
        'library',
        'view',
        vm.ownerId,
        vm.recordId,
        vm.version,
      ])
    );
  }
}

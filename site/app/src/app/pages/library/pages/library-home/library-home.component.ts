import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
} from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LibraryListComponent } from '@wbs/components/library/list';
import { LibraryListFiltersComponent } from '@wbs/components/library/list-filters';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { EntryCreationService } from '../../services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';

@Component({
  standalone: true,
  templateUrl: './library-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibraryListFiltersComponent, LibraryListComponent],
  providers: [EntryCreationService],
})
export class LibraryHomeComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly profile = inject(UserStore).profile;
  public readonly creation = inject(EntryCreationService);

  readonly organization = inject(MembershipStore).organization;
  readonly searchText = model<string>('');
  readonly typeFilters = model<string[]>([]);
  readonly library = model<string>('');

  ngOnInit(): void {
    this.library.set('personal');
    this.typeFilters.set([]);
  }

  create(type: string, list: LibraryListComponent): void {
    this.creation
      .runAsync(this.organization()!.name, type)
      .subscribe((results) => {
        console.log(results);
        if (results == undefined) return;

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
          ownerName: this.organization()!.display_name,
          status: results.version.status,
        };
        if (results.action === 'close') {
          list.entryAdded(vm);
        } else {
          this.nav(vm, results.action);
        }
      });
  }

  nav(vm: LibraryEntryViewModel | undefined, action?: string): void {
    if (!vm) return;

    this.store.dispatch(
      new Navigate([
        '/' + this.organization()!.name,
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

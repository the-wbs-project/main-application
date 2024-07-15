import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  inject,
  input,
  signal,
} from '@angular/core';
import { LibraryListComponent } from '@wbs/components/library/list';
import { LibraryListFiltersComponent } from '@wbs/components/library/list-filters';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { MembershipStore, UserStore } from '@wbs/core/store';
import { EntryCreationService } from '../../services';
import { LibraryCreateButtonComponent } from './components';
import { LibraryHomeService } from './services';
import { LibraryFilterComponent } from '@wbs/components/library/list-filters/components';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { LIBRARY_FILTER_LIBRARIES } from '@wbs/core/models';

@Component({
  standalone: true,
  templateUrl: './library-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LibraryCreateButtonComponent,
    LibraryListFiltersComponent,
    LibraryListComponent,
    LibraryFilterComponent,
    PageHeaderComponent,
  ],
  providers: [EntryCreationService, LibraryHomeService],
})
export class LibraryHomeComponent implements OnChanges {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;
  readonly service = inject(LibraryHomeService);

  readonly membership = inject(MembershipStore).membership;
  readonly library = input.required<string>();
  readonly searchText = signal<string>('');
  readonly roleFilters = signal<string[]>([]);
  readonly typeFilters = signal<string[]>([]);
  readonly entries = signal<LibraryEntryViewModel[]>([]);
  readonly libraries = LIBRARY_FILTER_LIBRARIES;

  ngOnChanges(): void {
    this.retrieve();
  }

  createEntry(type: string): void {
    this.service.createEntry(type).subscribe((entry) => {
      if (entry) {
        this.entries.update((entries) => [entry, ...entries]);
      }
    });
  }

  authorFilterChanged(filter: string[] | undefined): void {
    this.roleFilters.set(filter ?? []);
    this.retrieve();
  }

  typeFilterChanged(filter: string[] | undefined): void {
    this.typeFilters.set(filter ?? []);
    this.retrieve();
  }

  retrieve(): void {
    this.data.libraryEntries
      .searchAsync(this.membership()!.name, {
        userId: this.userId()!,
        library: this.library(),
        searchText: this.searchText(),
        roles: this.roleFilters(),
        types: this.typeFilters(),
      })
      .subscribe((entries) => this.entries.set(entries));
  }

  libraryChanged(library: string): void {
    if (library === this.library()) return;

    this.service.libraryChanged(library);
  }
}

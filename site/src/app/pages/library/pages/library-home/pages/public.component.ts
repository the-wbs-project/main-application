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
import { LibraryFilterComponent } from '@wbs/components/library/list-filters/components';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryViewModel } from '@wbs/core/view-models';
import { LIBRARY_FILTER_LIBRARIES } from '@wbs/core/models';
import { LibraryHomeService } from '../services';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LibraryListFiltersComponent,
    LibraryListComponent,
    LibraryFilterComponent,
    PageHeaderComponent,
  ],
  providers: [],
  template: `<div class="mg-y-10">
      <wbs-library-list-filters
        [(authorFilters)]="roleFilters"
        [(typeFilters)]="typeFilters"
        [(searchText)]="searchText"
        (authorFiltersChange)="retrieve()"
        (typeFiltersChange)="retrieve()"
        (searchTextChange)="retrieve()"
      />
    </div>
    <wbs-library-list
      [showLoading]="loading()"
      [entries]="entries()"
      [showOwner]="library() === 'public'"
      (selectedChange)="service.navigate($event)"
    />`,
})
export class LibraryPublicComponent implements OnChanges {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;
  readonly service = inject(LibraryHomeService);

  readonly membership = inject(MembershipStore).membership;
  readonly org = input.required<string>();
  readonly library = input.required<string>();
  readonly searchText = signal<string>('');
  readonly roleFilters = signal<string[]>([]);
  readonly typeFilters = signal<string[]>([]);
  readonly loading = signal(false);
  readonly entries = signal<LibraryViewModel[]>([]);
  readonly libraries = LIBRARY_FILTER_LIBRARIES;

  ngOnChanges(): void {
    this.retrieve();
  }

  createEntry(type: string): void {
    /*this.service.createEntry(type).subscribe((entry) => {
      if (entry) {
        this.entries.update((entries) => [entry, ...entries]);
      }
    });*/
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
    this.entries.set([]);
    this.loading.set(true);

    this.data.libraryEntries
      .searchAsync(this.org(), {
        userId: this.userId()!,
        library: this.library(),
        searchText: this.searchText(),
        roles: this.roleFilters(),
        types: this.typeFilters(),
      })
      .subscribe((entries) => {
        this.loading.set(false);
        this.entries.set(entries);
      });
  }

  libraryChanged(library: string): void {
    if (library === this.library()) return;

    this.service.libraryChanged(library);
  }
}

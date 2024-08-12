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
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryViewModel } from '@wbs/core/view-models';
import { LIBRARY_FILTER_LIBRARIES } from '@wbs/core/models';
import { LibraryHomeService } from '../services';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      [showOwner]="false"
      (selectedChange)="service.navigateToVm($event)"
    />`,
  imports: [LibraryListFiltersComponent, LibraryListComponent],
})
export class InternalComponent implements OnChanges {
  private readonly data = inject(DataServiceFactory);
  readonly service = inject(LibraryHomeService);

  readonly org = input.required<string>();
  readonly searchText = signal<string>('');
  readonly roleFilters = signal<string[]>([]);
  readonly typeFilters = signal<string[]>([]);
  readonly loading = signal(false);
  readonly entries = signal<LibraryViewModel[]>([]);
  readonly libraries = LIBRARY_FILTER_LIBRARIES;

  ngOnChanges(): void {
    this.retrieve();
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

    this.data.library
      .getInternalAsync(this.org(), {
        searchText: this.searchText(),
        roles: this.roleFilters(),
        types: this.typeFilters(),
      })
      .subscribe((entries) => {
        this.loading.set(false);
        this.entries.set(entries);
      });
  }
}

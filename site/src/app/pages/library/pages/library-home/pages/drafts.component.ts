import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  inject,
  input,
  signal,
} from '@angular/core';
import { LibraryListFiltersComponent } from '@wbs/components/library/list-filters';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryDraftViewModel } from '@wbs/core/view-models';
import { LibraryHomeService } from '../services';
import { LibraryDraftListComponent } from '../components/draft-list';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="mg-y-10">
      <wbs-library-list-filters
        [showAssociations]="false"
        [showSearch]="false"
        [(expanded)]="service.filtersExpanded"
        [(typeFilters)]="typeFilters"
        (typeFiltersChange)="retrieve()"
      />
    </div>
    <wbs-library-draft-list
      [showLoading]="loading()"
      [entries]="entries()"
      (selected)="service.navigateToVm($event)"
    />`,
  imports: [LibraryDraftListComponent, LibraryListFiltersComponent],
})
export class DraftsComponent implements OnChanges {
  private readonly data = inject(DataServiceFactory);
  readonly service = inject(LibraryHomeService);

  readonly org = input.required<string>();
  readonly typeFilters = signal<string[]>([]);
  readonly loading = signal(false);
  readonly entries = signal<LibraryDraftViewModel[]>([]);

  ngOnChanges(): void {
    this.retrieve();
  }

  typeFilterChanged(filter: string[] | undefined): void {
    this.typeFilters.set(filter ?? []);
    this.retrieve();
  }

  retrieve(): void {
    this.entries.set([]);
    this.loading.set(true);

    const typeFilter = this.typeFilters();
    const types = typeFilter.length > 0 ? typeFilter : 'all';

    this.data.library.getDraftsAsync(this.org(), types).subscribe((list) => {
      this.loading.set(false);
      this.entries.set(list);
    });
  }
}

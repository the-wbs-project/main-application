import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { LibraryFilterComponent } from './components';
import { LibrarySearchComponent } from '../search.component';
import { LibrarySelectorComponent } from '../selector';
import { NgClass } from '@angular/common';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  LIBRARY_FILTER_LIBRARIES,
  LIBRARY_FILTER_ROLES,
  LIBRARY_FILTER_TYPES,
} from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-library-list-filters',
  templateUrl: './library-list-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .filter-wrapper {
        display: block;
        transition: all 1s ease-in-out;
      }

      .filter-collapsed {
        height: 0;
        display: none;
      }
    `,
  ],
  imports: [
    ButtonModule,
    ExpansionPanelModule,
    FontAwesomeModule,
    LibrarySearchComponent,
    LibrarySelectorComponent,
    LibraryFilterComponent,
    NgClass,
    TranslateModule,
  ],
})
export class LibraryListFiltersComponent {
  readonly showLibrary = input(false);
  readonly searchText = model.required<string>();
  readonly typeFilters = model.required<string[]>();
  readonly authorFilters = model<string[]>();
  readonly library = model<string>();
  readonly expanded = signal(false);

  readonly FILTERS_LIBRARY = LIBRARY_FILTER_LIBRARIES;
  readonly FILTERS_ROLES = LIBRARY_FILTER_ROLES;
  readonly FILTERS_TYPE = LIBRARY_FILTER_TYPES;
  readonly upIcon = faChevronUp;
  readonly downIcon = faChevronDown;

  libraryChanged(value: string): void {
    if (this.library() === value) return;

    this.library.set(value);
  }

  roleChanged(value: string): void {
    this.authorFilters.update((filters) => {
      if (!filters) return [value];

      if (filters.includes(value)) {
        return filters.filter((filter) => filter !== value);
      }

      return [...filters, value];
    });
  }

  typeChanged(value: string): void {
    this.typeFilters.update((filters) => {
      if (!filters) return [value];

      if (filters.includes(value)) {
        return filters.filter((filter) => filter !== value);
      }

      return [...filters, value];
    });
  }
}

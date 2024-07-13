import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
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
export class LibraryHomeComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;
  readonly service = inject(LibraryHomeService);

  readonly membership = inject(MembershipStore).membership;
  readonly library = input.required<string>();
  readonly searchText = signal<string>('');
  readonly roleFilter = signal<string>('all');
  readonly typeFilter = signal<string>('all');
  readonly entries = signal<LibraryEntryViewModel[]>([]);
  readonly libraries = LIBRARY_FILTER_LIBRARIES;

  ngOnInit(): void {
    this.retrieve();
  }

  createEntry(type: string): void {
    this.service.createEntry(type).subscribe((entry) => {
      if (entry) {
        this.entries.update((entries) => [entry, ...entries]);
      }
    });
  }

  retrieve(): void {
    this.data.libraryEntries
      .searchAsync(this.membership()!.name, {
        userId: this.userId()!,
        library: this.library(),
        searchText: this.searchText(),
        role: this.roleFilter(),
        type: this.typeFilter(),
      })
      .subscribe((entries) => this.entries.set(entries));
  }
}

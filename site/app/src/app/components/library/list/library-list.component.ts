import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { UserStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-library-list',
  templateUrl: './library-list.component.html',
  styleUrl: './library-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'd-block overflow-auto flex-fill',
  },
  imports: [
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    NgClass,
    RouterModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class LibraryListComponent implements OnChanges {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  readonly org = input.required<string>();
  readonly typeFilters = input<string[]>();
  readonly library = input.required<string>();
  readonly searchText = input.required<string>();
  readonly showWatchedColumn = input(true);
  readonly selected = model<LibraryEntryViewModel | undefined>(undefined);
  readonly entries = signal<LibraryEntryViewModel[]>([]);
  readonly dblClick = output<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['searchText'] ||
      changes['library'] ||
      changes['typeFilters'] ||
      changes['org']
    ) {
      this.retrieve();
    }
  }

  entryAdded(vm: LibraryEntryViewModel): void {
    this.entries.set([vm, ...this.entries()]);
  }

  private retrieve(): void {
    this.data.libraryEntries
      .searchAsync(this.org(), {
        userId: this.userId()!,
        library: this.library(),
        searchText: this.searchText(),
        typeFilters: this.typeFilters(),
      })
      .subscribe((entries) => {
        this.entries.set(entries);
      });
  }
}

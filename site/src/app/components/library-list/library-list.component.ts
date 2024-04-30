import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
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
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { DelayedInputDirective } from '@wbs/core/directives/delayed-input.directive';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { UserStore } from '@wbs/store';

@Component({
  standalone: true,
  selector: 'wbs-library-list',
  templateUrl: './library-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    DelayedInputDirective,
    RouterModule,
    TextBoxModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class LibraryListComponent implements OnInit, OnChanges {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  readonly searchText = model<string>('');
  readonly org = input.required<string>();
  readonly library = input.required<string>();
  readonly entries = signal<LibraryEntryViewModel[]>([]);
  readonly selected = output<LibraryEntryViewModel>();

  ngOnInit(): void {
    this.searchText.subscribe(() => this.retrieve());
    this.searchText.set('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['library'] || changes['org']) {
      this.retrieve();
    }
  }

  private retrieve(): void {
    this.data.libraryEntries
      .searchAsync(this.org(), {
        userId: this.userId()!,
        library: this.library(),
        searchText: this.searchText(),
      })
      .subscribe((entries) => {
        this.entries.set(entries);
      });
  }
}

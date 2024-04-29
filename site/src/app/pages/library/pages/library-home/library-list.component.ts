import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { plusIcon } from '@progress/kendo-svg-icons';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { DelayedInputDirective } from '@wbs/core/directives/delayed-input.directive';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { UserStore } from '@wbs/store';
import { EntryTypeIconPipe } from '../../pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '../../pipes/entry-type-title.pipe';
import { EntryCreationService } from '../../services';
import { EntryCreateButtonComponent } from './components/entry-create-button/entry-create-button.component';
import { EntryLibraryChooserComponent } from './components/entry-library-chooser/entry-library-chooser.component';

@Component({
  standalone: true,
  templateUrl: './library-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    DialogModule,
    EntryCreateButtonComponent,
    EntryLibraryChooserComponent,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    FormsModule,
    DelayedInputDirective,
    NgClass,
    PageHeaderComponent,
    RouterModule,
    TextBoxModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
  providers: [EntryCreationService],
})
export class LibraryListComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(Store);
  private readonly userId = inject(UserStore).userId;
  public readonly creation = inject(EntryCreationService);

  readonly faCactus = faCactus;
  readonly faFilters = faFilters;

  readonly searchText = model<string>();
  readonly org = input.required<string>();
  readonly library = signal<string>('personal');
  readonly entries = signal<LibraryEntryViewModel[]>([]);

  filterToggle = false;
  expanded = true;

  readonly plusIcon = plusIcon;

  test(e: any) {
    console.log(e);
  }

  ngOnInit(): void {
    this.searchText.subscribe(() => this.retrieve());
    this.searchText.set('');
  }

  create(type: string): void {
    this.creation.runAsync(this.org(), type).subscribe((results) => {
      console.log(results);
      if (results == undefined) return;

      if (results.action === 'close') {
        const vm: LibraryEntryViewModel = {
          authorId: '',
          authorName: results.entry.author,
          entryId: results.entry.id,
          title: results.version.title,
          type: results.entry.type,
          visibility: results.entry.visibility,
          version: results.version.version,
          lastModified: results.version.lastModified,
          description: results.version.description,
          ownerId: results.entry.owner,
          ownerName: results.entry.owner,
          status: results.version.status,
        };

        this.entries.update((list) => {
          list.splice(0, 0, vm);
          return list;
        });
      } else {
        const url = [
          '/' + this.org(),
          'library',
          'view',
          results.entry.owner,
          results.entry.id,
          results.version.version,
        ];
        if (results.action === 'upload') url.push('upload');

        this.store.dispatch(new Navigate(url));
      }
    });
  }

  libraryChanged(library: string): void {
    this.library.set(library);
    this.retrieve();
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

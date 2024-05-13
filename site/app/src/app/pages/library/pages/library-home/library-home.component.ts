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
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LibraryListComponent } from '@wbs/components/library-list/library-list.component';
import { LibrarySearchComponent } from '@wbs/components/_utils/library-search.component';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DelayedInputDirective } from '@wbs/core/directives/delayed-input.directive';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { LibrarySelectorComponent } from '@wbs/components/library-selector';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { EntryCreationService } from '../../services';
import { EntryCreateButtonComponent } from './components';

@Component({
  standalone: true,
  templateUrl: './library-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    DialogModule,
    EntryCreateButtonComponent,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    FormsModule,
    DelayedInputDirective,
    LibraryListComponent,
    LibrarySearchComponent,
    LibrarySelectorComponent,
    NgClass,
    PageHeaderComponent,
    RouterModule,
    TextBoxModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
  providers: [EntryCreationService],
})
export class LibraryHomeComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly creation = inject(EntryCreationService);

  readonly searchText = model<string>('');
  readonly org = input.required<string>();
  readonly library = model<string>('');

  ngOnInit(): void {
    this.library.set('personal');
  }

  create(type: string): void {
    this.creation.runAsync(this.org(), type).subscribe((results) => {
      console.log(results);
      if (results == undefined) return;

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
      if (results.action === 'close') {
        //
        //  Figure out how to refresh the list
        //
        /*this.entries.update((list) => {
          list.splice(0, 0, vm);
          return list;
        });*/
      } else {
        this.nav(vm, results.action);
      }
    });
  }

  nav(vm: LibraryEntryViewModel | undefined, action?: string): void {
    if (!vm) return;

    this.store.dispatch(
      new Navigate([
        '/' + this.org(),
        'library',
        'view',
        vm.ownerId,
        vm.entryId,
        vm.version,
        ...(action ? [action] : []),
      ])
    );
  }
}

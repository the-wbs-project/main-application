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
import { EntryCreateButtonComponent } from '@wbs/dummy_components/entry-create-button/entry-create-button.component';
import { EntryLibraryChooserComponent } from '@wbs/dummy_components/entry-library-chooser/entry-library-chooser.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { UserStore } from '@wbs/store';
import { EntryCreationService } from '../../services';
import { LibraryListComponent } from '@wbs/components/library-list/library-list.component';

@Component({
  standalone: true,
  templateUrl: './library-home.component.html',
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
    LibraryListComponent,
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

  nav(vm: LibraryEntryViewModel, action?: string): void {
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

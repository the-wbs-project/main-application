import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { plusIcon } from '@progress/kendo-svg-icons';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { EntryTypeDescriptionPipe } from '../../pipes/entry-type-description.pipe';
import { EntryTypeIconPipe } from '../../pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '../../pipes/entry-type-title.pipe';
import { EntryCreationService } from './services';

@Component({
  standalone: true,
  templateUrl: './library-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    DialogModule,
    DropDownButtonModule,
    EntryTypeDescriptionPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    NgClass,
    PageHeaderComponent,
    RouterModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
  providers: [EntryCreationService],
})
export class LibraryListComponent implements OnInit {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(Store);
  public readonly creation = inject(EntryCreationService);

  readonly faCactus = faCactus;
  readonly faFilters = faFilters;
  readonly createMenu = ['project', 'phase', 'task'];

  readonly org = input.required<string>();
  readonly entries = signal<LibraryEntryViewModel[]>([]);

  filterToggle = false;
  expanded = true;

  readonly plusIcon = plusIcon;

  ngOnInit(): void {
    this.data.libraryEntries.getAllAsync(this.org()).subscribe((entries) => {
      this.entries.set(entries);
    });
  }

  force() {
    this.cd.detectChanges();
  }

  create(type: string): void {
    this.creation.runAsync(this.org(), type).subscribe((results) => {
      console.log(results);
      if (results == undefined) return;

      if (results.action === 'close') {
        const vm: LibraryEntryViewModel = {
          author: results.entry.author,
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
}

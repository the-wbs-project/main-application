import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { VisibilityTextComponent } from '@wbs/components/_utils/visibility-text.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { EntryStore } from '@wbs/core/store';
import { WbsNodeView } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { LibraryStatusPipe } from '@wbs/pipes/library-status.pipe';
import { UserNamePipe } from '@wbs/pipes/user-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    AsyncPipe,
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    FormsModule,
    LibraryStatusPipe,
    TranslateModule,
    UserNamePipe,
    VisibilityTextComponent,
  ],
})
export class DetailsCardComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  readonly store = inject(EntryStore);

  readonly owner = signal<string>('');

  ngOnInit(): void {
    this.data.organizations
      .getNameAsync(this.store.entry()!.owner)
      .subscribe((name) => this.owner.set(name));
  }
}
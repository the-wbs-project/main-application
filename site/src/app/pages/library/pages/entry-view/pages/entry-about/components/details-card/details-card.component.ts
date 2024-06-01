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
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { VisibilityTextComponent } from '@wbs/components/_utils/visibility-text.component';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';

@Component({
  standalone: true,
  selector: 'wbs-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    FormsModule,
    TranslateModule,
    VisibilityTextComponent,
  ],
})
export class DetailsCardComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);

  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();

  readonly owner = signal<string>('');

  ngOnInit(): void {
    this.data.organizations
      .getNameAsync(this.entry().owner)
      .subscribe((name) => this.owner.set(name));
  }
}

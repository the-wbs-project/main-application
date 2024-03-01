import { NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '../../../../../../pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '../../../../../../pipes/entry-type-title.pipe';

@Component({
  standalone: true,
  selector: 'wbs-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    FormsModule,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class DetailsCardComponent {
  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();
}

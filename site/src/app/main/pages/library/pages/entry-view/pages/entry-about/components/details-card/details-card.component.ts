import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '../../../../../../pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '../../../../../../pipes/entry-type-title.pipe';
import { DataServiceFactory } from '@wbs/core/data-services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'wbs-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card border' },
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

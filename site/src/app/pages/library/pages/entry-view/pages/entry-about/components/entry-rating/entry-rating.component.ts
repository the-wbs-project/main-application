import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RatingModule } from '@progress/kendo-angular-inputs';
import { VisibilityTextComponent } from '@wbs/components/_utils/visibility-text.component';
import { OrganizationService } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';
import { LibraryStatusPipe } from '@wbs/pipes/library-status.pipe';
import { UserNamePipe } from '@wbs/pipes/user-name.pipe';

@Component({
  standalone: true,
  selector: 'wbs-entry-rating',
  templateUrl: './entry-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [RatingModule],
})
export class EntryRatingComponent implements OnInit {
  private readonly orgService = inject(OrganizationService);

  readonly store = inject(EntryStore);
  readonly owner = signal('');

  ngOnInit(): void {
    this.orgService
      .getNameAsync(this.store.entry()!.owner)
      .subscribe((name) => this.owner.set(name ?? ''));
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { OrganizationService } from '@wbs/core/services';
import { TaskViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-details-card',
  templateUrl: './details-card.component.html',
  host: { class: 'card dashboard-card' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateTextPipe, RouterModule, TranslateModule],
})
export class DetailsCardComponent implements OnChanges {
  private readonly orgService = inject(OrganizationService);

  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();
  readonly task = input.required<TaskViewModel>();

  readonly owner = signal<string | undefined>(undefined);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entry'] && this.entry()) {
      this.orgService
        .getNameAsync(this.entry().owner)
        .subscribe((name) => this.owner.set(name));
    }
  }
}

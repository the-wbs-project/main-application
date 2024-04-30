import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-details-card',
  templateUrl: './details-card.component.html',
  host: { class: 'card dashboard-card' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateTextPipe, RouterModule, TranslateModule],
})
export class DetailsCardComponent {
  private readonly data = inject(DataServiceFactory);

  readonly entry = input.required<LibraryEntry>();
  readonly version = input.required<LibraryEntryVersion>();
  readonly task = input.required<WbsNodeView>();

  readonly owner = signal<string | undefined>(undefined);

  constructor() {
    effect(() => {
      const id = this.entry().owner;

      if (id)
        this.data.organizations
          .getNameAsync(id)
          .subscribe((name) => this.owner.set(name));
    });
  }
}

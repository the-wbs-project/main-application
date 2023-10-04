import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { CreateJiraTicket } from '../../actions';

@Component({
  standalone: true,
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, LoaderModule, NgIf, TranslateModule],
})
export class TicketViewComponent {
  @Input() reasonCode!: string;

  readonly sending = signal<boolean>(false);
  readonly mode = signal<'description' | 'thank-you'>('description');

  constructor(private readonly store: Store) {}

  go(description: string): void {
    this.sending.set(true);

    this.store
      .dispatch(new CreateJiraTicket(description.trim()))
      .subscribe(() => {
        this.mode.set('thank-you');
        this.sending.set(false);
      });
  }
}

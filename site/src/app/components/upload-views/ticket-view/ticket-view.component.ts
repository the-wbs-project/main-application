import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { CreateJiraTicket } from '../../actions';
import { EntryUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './ticket-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterModule, TextAreaModule, TranslateModule],
})
export class TicketViewComponent {
  readonly entryUrl = input.required<string[]>();
  readonly reasonCode = input.required<string>();
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

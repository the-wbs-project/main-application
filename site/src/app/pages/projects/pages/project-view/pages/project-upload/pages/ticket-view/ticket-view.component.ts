import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { CreateJiraTicket } from '../../actions';
import { ProjectStore } from '../../../../stores';

@Component({
  standalone: true,
  templateUrl: './ticket-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderModule, NgIf, RouterModule, TextAreaModule, TranslateModule],
})
export class TicketViewComponent {
  readonly reasonCode = input<string>();
  readonly sending = signal<boolean>(false);
  readonly mode = signal<'description' | 'thank-you'>('description');
  readonly project = inject(ProjectStore).project()!;

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

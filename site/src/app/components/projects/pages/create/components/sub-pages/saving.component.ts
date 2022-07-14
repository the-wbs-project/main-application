import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { GoToBasics } from '../../project-create.actions';

@Component({
  selector: 'app-project-create-saving',
  template: `<p>
    <button class="btn btn-primary" (click)="nav()">Continue</button>
  </p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingComponent {
  constructor(private readonly store: Store) {}

  nav() {
    this.store.dispatch(new GoToBasics());
  }
}

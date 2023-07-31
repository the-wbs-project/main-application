import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { GoToBasics } from '../../actions';

@Component({
  standalone: true,
  selector: 'wbs-project-create-getting-started',
  template: `<p>
    <button class="btn btn-primary" (click)="nav()">
      {{ 'General.Continue' | translate }}
    </button>
  </p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class GettingStartedComponent {
  constructor(private readonly store: Store) {}

  nav() {
    this.store.dispatch(new GoToBasics());
  }
}

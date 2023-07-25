import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { AppendOrOvewriteSelected } from '../../actions';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule]
})
export class OptionsViewComponent {
  readonly faQuestion = faQuestion;

  constructor(private readonly store: Store) {}

  select(answer: 'append' | 'overwrite'): void {
    this.store.dispatch(new AppendOrOvewriteSelected(answer));
  }
}

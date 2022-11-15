import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { AppendOrOvewriteSelected } from '../../actions';

@Component({
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsViewComponent {
  readonly faQuestion = faQuestion;

  constructor(private readonly store: Store) {}

  select(answer: 'append' | 'overwrite'): void {
    this.store.dispatch(new AppendOrOvewriteSelected(answer));
  }
}

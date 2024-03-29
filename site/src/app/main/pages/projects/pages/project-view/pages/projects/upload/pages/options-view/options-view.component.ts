import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { AppendOrOvewriteSelected } from '../../actions';

@Component({
  standalone: true,
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
})
export class OptionsViewComponent {
  readonly faQuestion = faQuestion;

  constructor(private readonly store: Store) {}

  select(answer: 'append' | 'overwrite'): void {
    this.store.dispatch(new AppendOrOvewriteSelected(answer));
  }
}

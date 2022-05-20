import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  faScrewdriver,
  faScrewdriverWrench,
} from '@fortawesome/pro-duotone-svg-icons';
import { Store } from '@ngxs/store';
import { PROJECT_SCOPE } from '@wbs/shared/models';
import { SubmitScope } from '../../../project-create.actions';

@Component({
  selector: 'app-project-create-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScopeComponent {
  readonly faScrewdriver = faScrewdriver;
  readonly faScrewdriverWrench = faScrewdriverWrench;

  constructor(private readonly store: Store) {}

  single(): void {
    this.store.dispatch(new SubmitScope(PROJECT_SCOPE.SINGLE));
  }

  multi(): void {
    this.store.dispatch(new SubmitScope(PROJECT_SCOPE.MULTI));
  }
}

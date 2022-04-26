import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Messages } from '@wbs/services';
import { Observable } from 'rxjs';
import { DialogViewSelected } from '../../actions';
import { NodeCreationState } from '../../state';

@Component({
  selector: 'wbs-node-starter',
  templateUrl: './starter.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {
  @Select(NodeCreationState.parentTitle) parentTitle$!: Observable<string>;

  constructor(
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  starterSelected(answer: 'scratch' | 'library') {
    this.store.dispatch(new DialogViewSelected(answer));
  }

  comingSoon() {
    this.messages.success('Coming soon...');
  }
}

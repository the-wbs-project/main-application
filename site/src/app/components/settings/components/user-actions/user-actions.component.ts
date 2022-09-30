import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { ContextMenuSelectEvent } from '@progress/kendo-angular-menu';
import { Messages } from '@wbs/shared/services';
import { ActivateUser, DeactivateUser } from '../../actions';
import { UserViewModel } from '../../models';

@Component({
  selector: 'app-settings-user-actions',
  templateUrl: './user-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UserActionsComponent {
  @Input() user: UserViewModel | undefined;

  readonly faEllipsisVertical = faEllipsisVertical;

  constructor(
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  protected selected(e: ContextMenuSelectEvent) {
    const action = e.item.id;

    if (this.user)
      if (action === 'view') {
        this.messages.info('Coming soon...', false);
      } else if (action === 'deactivate') {
        this.store.dispatch(new DeactivateUser(this.user.id));
      } else if (action === 'activate') {
        this.store.dispatch(new ActivateUser(this.user.id));
      }
  }
}

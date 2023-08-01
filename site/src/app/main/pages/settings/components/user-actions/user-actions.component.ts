import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  ContextMenuModule,
  ContextMenuSelectEvent,
} from '@progress/kendo-angular-menu';
import { Messages } from '@wbs/core/services';
import { ActivateUser, DeactivateUser } from '../../actions';
import { UserViewModel } from '../../models';
import { UserMgmtItemsPipe } from '../../pipes/user-mgmt-items.pipe';

@Component({
  standalone: true,
  selector: 'wbs-settings-user-actions',
  templateUrl: './user-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ContextMenuModule,
    FontAwesomeModule,
    TranslateModule,
    UserMgmtItemsPipe,
  ],
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

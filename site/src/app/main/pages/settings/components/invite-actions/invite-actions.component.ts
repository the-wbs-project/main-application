import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisVertical,
  faEnvelope,
  faPencil,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  ContextMenuModule,
  ContextMenuSelectEvent,
} from '@progress/kendo-angular-menu';
import { Invite } from '@wbs/core/models';
import { CancelInvite, ResendInvite } from '../../actions';

@Component({
  standalone: true,
  selector: 'wbs-settings-invite-actions',
  templateUrl: './invite-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ContextMenuModule, FontAwesomeModule, TranslateModule],
})
export class InviteActionsComponent {
  @Input() invite: Invite | undefined;

  readonly faEllipsisVertical = faEllipsisVertical;
  readonly items = [
    {
      id: 'resend',
      title: 'Settings.ResendInvite',
      faIcon: faEnvelope,
    },
    {
      id: 'edit',
      title: 'Settings.EditInvite',
      faIcon: faPencil,
    },
    {
      id: 'cancel',
      title: 'Settings.CancelInvite',
      faIcon: faX,
    },
  ];
  constructor(private readonly store: Store) {}

  protected selected(e: ContextMenuSelectEvent) {
    const action = e.item.id;

    if (this.invite)
      if (action === 'resend') {
        this.store.dispatch(new ResendInvite(this.invite.id));
      } else if (action === 'edit') {
        this.store.dispatch(
          new Navigate(['/settings', 'invites', this.invite.id])
        );
      } else if (action === 'cancel') {
        this.store.dispatch(new CancelInvite(this.invite.id));
      }
  }
}

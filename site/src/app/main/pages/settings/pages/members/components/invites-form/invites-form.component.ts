import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ROLES } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { InviteValidators } from './invite-validators.service';

@Component({
  standalone: true,
  templateUrl: './invites-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InviteValidators],
  imports: [CommonModule, TranslateModule, RoleListPipe],
})
export class InvitesFormComponent {
  readonly roleList = [ROLES.PM, ROLES.APPROVER, ROLES.SME, ROLES.ADMIN];
  roles: string[] = [];
  errors: { email: string; error: string }[] = [];

  constructor(
    readonly modal: NgbActiveModal,
    private readonly store: Store,
    private readonly validators: InviteValidators
  ) {}

  toggleRole(role: string): void {
    const index = this.roles.indexOf(role);

    if (index > -1) this.roles.splice(index, 1);
    else this.roles.push(role);
  }

  submit(emails: string) {
    const list = emails.split(',').map((e) => e.trim());

    const alreadyExists = this.validators.checkIfAnyExists(list);
    const alreadyInvited = this.validators.checkIfAnyInvited(list);

    if (alreadyExists.length === 0 && alreadyInvited.length === 0) {
      this.modal.close(list);
      return;
    } else {
      this.errors = [
        ...alreadyExists.map((email) => ({
          email,
          error: 'General.UserAlreadyExists',
        })),
        ...alreadyInvited.map((email) => ({
          email,
          error: 'General.UserAlreadyInvited',
        })),
      ];
    }
    //
  }
}

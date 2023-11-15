import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { RoleState } from '@wbs/main/states';
import { SendInvites } from '../../actions';
import { InviteValidators } from './invite-validators.service';
import { Member } from '@wbs/core/models';

declare type InviteError = { email?: string; error: string };

@Component({
  standalone: true,
  templateUrl: './invites-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InviteValidators],
  imports: [CommonModule, TranslateModule, RoleListPipe],
})
export class InvitesFormComponent {
  readonly roleList = toSignal(this.store.select(RoleState.definitions));
  roles: string[] = [];
  errors: InviteError[] = [];
  members!: Member[];

  constructor(
    readonly modal: NgbActiveModal,
    private readonly store: Store,
    private readonly validators: InviteValidators
  ) {}

  setup(members: Member[]): void {
    this.members = members;
  }

  toggleRole(role: string): void {
    const index = this.roles.indexOf(role);

    if (index > -1) this.roles.splice(index, 1);
    else this.roles.push(role);
  }

  submit(emailText: string) {
    const emails = emailText.split(',').map((e) => e.trim());
    const errors: InviteError[] = [];
    const hasRoles = this.roles.length > 0;
    const hasEmails = emails.length > 0;

    if (!hasRoles) errors.push({ error: 'OrgSettings.InviteErrorNoRoles' });

    if (!hasEmails) {
      errors.push({ error: 'OrgSettings.InviteErrorNoEmails' });
    } else {
      for (const email of this.validators.checkIfAnyInvalid(emails)) {
        errors.push({ email, error: 'OrgSettings.InviteErrorInvalidEmail' });
      }

      for (const email of this.validators.checkIfAnyExists(
        this.members,
        emails
      )) {
        errors.push({ email, error: 'OrgSettings.InviteErrorAlreadyMember' });
      }

      for (const email of this.validators.checkIfAnyInvited(emails)) {
        errors.push({ email, error: 'OrgSettings.InviteErrorAlreadySent' });
      }
    }
    if (errors.length === 0) {
      this.store.dispatch(new SendInvites(emails, this.roles)).subscribe(() => {
        this.modal.close();
      });
    } else {
      this.errors = errors;
    }
  }
}

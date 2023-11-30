import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Invite, Member, Role } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { InviteValidators } from './invite-validators.service';

declare type InviteError = { email?: string; error: string };

@Component({
  standalone: true,
  templateUrl: './invites-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InviteValidators],
  imports: [NgClass, RoleListPipe, TranslateModule],
})
export class InvitesFormComponent {
  roles: string[] = [];
  errors: InviteError[] = [];
  members!: Member[];
  invites!: Invite[];
  roleDefinitions!: Role[];

  constructor(
    readonly modal: NgbActiveModal,
    private readonly validators: InviteValidators
  ) {}

  setup({
    invites,
    members,
    roles,
  }: {
    invites: Invite[];
    members: Member[];
    roles: Role[];
  }): void {
    this.invites = invites;
    this.members = members;
    this.roleDefinitions = roles;
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

      for (const email of this.validators.checkIfAnyInvited(
        this.invites,
        emails
      )) {
        errors.push({ email, error: 'OrgSettings.InviteErrorAlreadySent' });
      }
    }
    if (errors.length === 0) {
      this.modal.close({ emails, roles: this.roles });
    } else {
      this.errors = errors;
    }
  }
}

import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { Invite, Member, Role } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { InviteValidators } from './invite-validators.service';

declare type InviteError = { email?: string; error: string };

@Component({
  standalone: true,
  selector: 'wbs-invitation-form',
  templateUrl: './invitation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InviteValidators],
  imports: [DialogModule, NgClass, RoleListPipe, TranslateModule],
})
export class InvitationFormComponent {
  @Output() readonly submitted = new EventEmitter<{
    roles: string[];
    emails: string[];
  }>();

  readonly show = model.required<boolean>();

  roles: string[] = [];
  errors: InviteError[] = [];
  members!: Member[];
  invites!: Invite[];
  roleDefinitions!: Role[];

  constructor(private readonly validators: InviteValidators) {}

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
      this.submitted.emit({ emails, roles: this.roles });
    } else {
      this.errors = errors;
    }
  }
}

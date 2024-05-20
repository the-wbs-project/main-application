import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { Invite, Member, Role } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InviteFormResults } from './invite-form-results.model';
import { InviteValidators } from './invite-validators.service';

declare type InviteError = { email?: string; error: string };

@Component({
  standalone: true,
  selector: 'wbs-invitation-form',
  templateUrl: './invitation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InviteValidators],
  imports: [DialogModule, NgClass, TranslateModule],
})
export class InvitationFormComponent extends DialogContentBase {
  private readonly validators = inject(InviteValidators);

  readonly roles = signal<string[]>([]);
  errors: InviteError[] = [];
  members!: Member[];
  invites!: Invite[];
  roleDefinitions!: Role[];

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    invites: Invite[],
    members: Member[],
    roles: Role[]
  ): Observable<InviteFormResults | undefined> {
    const ref = dialog.open({
      content: InvitationFormComponent,
    });
    const component = ref.content.instance as InvitationFormComponent;

    component.invites = invites;
    component.members = members;
    component.roleDefinitions = roles;

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <InviteFormResults>x
      )
    );
  }

  toggleRole(role: string): void {
    this.roles.update((roles) => {
      const index = roles.indexOf(role);

      if (index > -1) roles.splice(index, 1);
      else roles.push(role);

      return [...roles];
    });
  }

  submit(emailText: string) {
    const emails = emailText.split(',').map((e) => e.trim());
    const errors: InviteError[] = [];
    const hasRoles = this.roles().length > 0;
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
      this.dialog.close({ emails, roles: this.roles() });
    } else {
      this.errors = errors;
    }
  }
}

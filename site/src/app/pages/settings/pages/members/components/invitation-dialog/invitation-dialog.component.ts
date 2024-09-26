import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { Invite } from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';
import { MemberSettingsService } from '../../services';
import { InvitationValidators } from './invitation-validators.service';

declare type InviteError = { email?: string; error: string };

@Component({
  standalone: true,
  templateUrl: './invitation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InvitationValidators],
  imports: [
    ButtonGroupModule,
    ButtonModule,
    DialogModule,
    LabelModule,
    SaveButtonComponent,
    TextAreaModule,
    TranslateModule,
  ],
})
export class InvitationDialogComponent extends DialogContentBase {
  private readonly validators = inject(InvitationValidators);
  private readonly memberService = inject(MemberSettingsService);
  private members!: UserViewModel[];
  private invites!: Invite[];

  readonly saveState = new SaveService();

  readonly selectedRoles = signal<string[]>([]);
  readonly errors = signal<InviteError[]>([]);
  readonly roles = inject(MetadataStore).roles.definitions;

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launch(
    dialog: DialogService,
    invites: Invite[],
    members: UserViewModel[]
  ): void {
    const ref = dialog.open({
      content: InvitationDialogComponent,
    });
    const component = ref.content.instance as InvitationDialogComponent;

    component.invites = invites;
    component.members = members;
  }

  toggleRole(role: string): void {
    this.selectedRoles.update((roles) => {
      const index = roles.indexOf(role);

      if (index > -1) roles.splice(index, 1);
      else roles.push(role);

      return [...roles];
    });
  }

  submit(emailText: string) {
    const emails = emailText.split(',').map((e) => e.trim());
    const errors: InviteError[] = [];
    const selectedRoles = this.selectedRoles();
    const hasRoles = selectedRoles.length > 0;
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
    if (errors.length > 0) {
      this.errors.set(errors);
      return;
    }
    this.saveState
      .quickCall(this.memberService.sendInvitesAsync(emails, selectedRoles))
      .subscribe(() => this.dialog.close());
  }
}

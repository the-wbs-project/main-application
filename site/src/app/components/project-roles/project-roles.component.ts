import {
  ChangeDetectionStrategy,
  Component,
  OutputEmitterRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { minusIcon, plusIcon } from '@progress/kendo-svg-icons';
import { User } from '@wbs/core/models';
import { Messages, Resources } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { UserListComponent } from '../user-list';

declare type OutputType = {
  user: User;
  role: string;
};

@Component({
  standalone: true,
  selector: 'wbs-project-roles',
  templateUrl: './project-roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserListComponent, TranslateModule],
})
export class ProjectRolesComponent {
  private readonly messages = inject(Messages);
  private readonly metadata = inject(MetadataStore);
  private readonly resources = inject(Resources);

  readonly mustConfirm = input<boolean>(false);
  readonly members = input.required<User[]>();
  readonly approvers = input.required<User[]>();
  readonly pms = input.required<User[]>();
  readonly smes = input.required<User[]>();
  readonly approvalEnabled = input.required<boolean>();

  readonly addUserToRole = output<OutputType>();
  readonly removeUserToRole = output<OutputType>();

  readonly unassignedApprovers = computed(() =>
    this.unassigned(this.members(), this.approvers())
  );
  readonly unassignedPms = computed(() =>
    this.unassigned(this.members(), this.pms())
  );
  readonly unassignedSmes = computed(() =>
    this.unassigned(this.members(), this.smes())
  );

  readonly minusIcon = minusIcon;
  readonly plusIcon = plusIcon;

  add(role: string, user: User) {
    this.run(
      role,
      user,
      'ProjectSettings.AddUserConfirmation',
      this.addUserToRole
    );
  }

  remove(role: string, user: User) {
    this.run(
      role,
      user,
      'ProjectSettings.RemoveUserConfirmation',
      this.removeUserToRole
    );
  }

  private run(
    role: string,
    user: User,
    message: string,
    output: OutputEmitterRef<OutputType>
  ): void {
    if (!this.mustConfirm()) {
      output.emit({ user, role });
      return;
    }
    const roleTitle = this.resources.get(
      this.metadata.roles.definitions.find((x) => x.id === role)!.description
    );

    this.messages.confirm
      .show('General.Confirmation', message, {
        ROLE_NAME: roleTitle,
        USER_NAME: user.fullName,
      })
      .subscribe((answer) => {
        if (answer) output.emit({ user, role });
      });
  }

  private unassigned(
    members: User[] | undefined,
    assigned: User[] | undefined
  ): User[] {
    const ids = assigned?.map((x) => x.userId) ?? [];

    return members?.filter((x) => !ids.includes(x.userId)) ?? [];
  }
}

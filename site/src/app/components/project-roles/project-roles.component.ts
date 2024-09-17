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
import { Messages, Resources } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';
import { UserListComponent } from '../user-list';

declare type OutputType = {
  user: UserViewModel;
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
  readonly members = input.required<UserViewModel[]>();
  readonly approvers = input.required<UserViewModel[]>();
  readonly pms = input.required<UserViewModel[]>();
  readonly smes = input.required<UserViewModel[]>();
  readonly approvalEnabled = input.required<boolean>();

  readonly addUserToRole = output<OutputType>();
  readonly removeUserToRole = output<OutputType>();

  readonly roles = this.metadata.roles.ids;

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

  add(role: string, user: UserViewModel) {
    this.run(
      role,
      user,
      'ProjectSettings.AddUserConfirmation',
      this.addUserToRole
    );
  }

  remove(role: string, user: UserViewModel) {
    this.run(
      role,
      user,
      'ProjectSettings.RemoveUserConfirmation',
      this.removeUserToRole
    );
  }

  private run(
    role: string,
    user: UserViewModel,
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
    members: UserViewModel[] | undefined,
    assigned: UserViewModel[] | undefined
  ): UserViewModel[] {
    const ids = assigned?.map((x) => x.userId) ?? [];

    return members?.filter((x) => !ids.includes(x.userId)) ?? [];
  }
}

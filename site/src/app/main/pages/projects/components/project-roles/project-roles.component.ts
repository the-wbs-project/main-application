import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { minusIcon, plusIcon } from '@progress/kendo-svg-icons';
import { Member } from '@wbs/core/models';
import { Messages, Resources, SignalStore } from '@wbs/core/services';
import { RoleState } from '@wbs/main/states';
import { ProjectUserListComponent } from '../user-list';
import { RoleUsersService } from './services';
import { RoleUsersViewModel } from './view-models';

declare type OutputType = {
  user: Member;
  role: string;
};

@Component({
  standalone: true,
  selector: 'wbs-project-roles',
  templateUrl: './project-roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectUserListComponent, TranslateModule],
  providers: [RoleUsersService],
})
export class ProjectRolesComponent {
  @Output() readonly addUserToRole = new EventEmitter<OutputType>();
  @Output() readonly removeUserToRole = new EventEmitter<OutputType>();

  private readonly messages = inject(Messages);
  private readonly resources = inject(Resources);
  private readonly service = inject(RoleUsersService);
  private readonly store = inject(SignalStore);

  readonly mustConfirm = input<boolean>(false);
  readonly members = input<Member[]>();
  readonly approverIds = input<string[]>();
  readonly pmIds = input<string[]>();
  readonly smeIds = input<string[]>();
  readonly approvalEnabled = input.required<boolean>();

  readonly roles = this.store.select(RoleState.ids);
  readonly approvers = computed(() =>
    this.process(this.roles()!.approver, this.members(), this.approverIds())
  );
  readonly pms = computed(() =>
    this.process(this.roles()!.pm, this.members(), this.pmIds())
  );
  readonly smes = computed(() =>
    this.process(this.roles()!.sme, this.members(), this.smeIds())
  );

  readonly minusIcon = minusIcon;
  readonly plusIcon = plusIcon;

  add(role: string, user: Member) {
    this.run(
      role,
      user,
      'ProjectSettings.AddUserConfirmation',
      this.addUserToRole
    );
  }

  remove(role: string, user: Member) {
    this.run(
      role,
      user,
      'ProjectSettings.RemoveUserConfirmation',
      this.removeUserToRole
    );
  }

  private run(
    role: string,
    user: Member,
    message: string,
    output: EventEmitter<OutputType>
  ): void {
    if (!this.mustConfirm()) {
      output.emit({ user, role });
      return;
    }
    const roleTitle = this.resources.get(
      this.store
        .selectSnapshot(RoleState.definitions)
        .find((x) => x.id === role)!.description
    );

    this.messages.confirm
      .show('General.Confirmation', message, {
        ROLE_NAME: roleTitle,
        USER_NAME: user.name,
      })
      .subscribe((answer) => {
        if (answer) output.emit({ user, role });
      });
  }

  private process(
    role: string,
    members: Member[] | undefined,
    approverIds: string[] | undefined
  ): RoleUsersViewModel | undefined {
    return approverIds && members
      ? this.service.get(role, approverIds, members)
      : undefined;
  }
}

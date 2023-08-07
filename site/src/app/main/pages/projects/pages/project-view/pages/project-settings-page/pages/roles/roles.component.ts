import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ROLES, ROLES_CONST, ROLES_TYPE, UserLite } from '@wbs/core/models';
import { MembershipState } from '@wbs/main/states';
import { AddUserToRole, RemoveUserToRole } from '../../../../actions';
import { ProjectUserListComponent } from '../../../../components/user-list/user-list.component';
import { ProjectState } from '../../../../states';
import { RoleUsersService } from './role-users.service';

@Component({
  standalone: true,
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoleUsersService],
  imports: [ProjectUserListComponent, TranslateModule],
})
export class ProjectSettingsRolesComponent {
  private readonly service = inject(RoleUsersService);
  private readonly store = inject(Store);
  private readonly members = toSignal(this.store.select(MembershipState.users));
  private readonly memberRoles = toSignal(
    this.store.select(MembershipState.userRoles)
  );
  private readonly approverIds = toSignal(
    this.store.select(ProjectState.approvers)
  );
  private readonly pmIds = toSignal(this.store.select(ProjectState.pms));
  private readonly smeIds = toSignal(this.store.select(ProjectState.smes));

  readonly roles = ROLES_CONST;
  readonly approvers = computed(() =>
    this.service.get(
      ROLES.APPROVER,
      this.approverIds(),
      this.members()!,
      this.memberRoles()!
    )
  );
  readonly pms = computed(() =>
    this.service.get(
      ROLES.PM,
      this.pmIds(),
      this.members()!,
      this.memberRoles()!
    )
  );
  readonly smes = computed(() =>
    this.service.get(
      ROLES.SME,
      this.smeIds(),
      this.members()!,
      this.memberRoles()!
    )
  );
  readonly faUserPlus = faUserPlus;
  readonly faUserMinus = faUserMinus;

  add(role: ROLES_TYPE, user: UserLite) {
    this.store.dispatch(new AddUserToRole(role, user));
  }

  remove(role: ROLES_TYPE, user: UserLite) {
    this.store.dispatch(new RemoveUserToRole(role, user));
  }
}

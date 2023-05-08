import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { OrganizationState } from '@wbs/core/states';
import { RoleUsersService } from './role-users.service';
import { ROLES, ROLES_CONST, ROLES_TYPE, UserLite } from '@wbs/core/models';
import {
  AddUserToRole,
  RemoveUserToRole,
} from '@wbs/components/projects/actions';

@Component({
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoleUsersService],
})
export class ProjectSettingsRolesComponent {
  private readonly service = inject(RoleUsersService);
  private readonly store = inject(Store);
  private readonly users = toSignal(this.store.select(OrganizationState.users));
  private readonly approverIds = toSignal(
    this.store.select(ProjectState.approvers)
  );
  private readonly pmIds = toSignal(this.store.select(ProjectState.pms));
  private readonly smeIds = toSignal(this.store.select(ProjectState.smes));

  readonly roles = ROLES_CONST;
  readonly approvers = computed(() =>
    this.service.get(ROLES.APPROVER, this.approverIds(), this.users()!)
  );
  readonly pms = computed(() =>
    this.service.get(ROLES.PM, this.pmIds(), this.users()!)
  );
  readonly smes = computed(() =>
    this.service.get(ROLES.SME, this.smeIds(), this.users()!)
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

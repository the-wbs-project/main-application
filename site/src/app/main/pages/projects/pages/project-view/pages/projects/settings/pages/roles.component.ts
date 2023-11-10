import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Member, Project, ROLES, Role } from '@wbs/core/models';
import { ProjectRolesComponent } from '@wbs/main/pages/projects/components/project-roles/project-roles.component';
import { MembershipState, RoleState } from '@wbs/main/states';
import { AddUserToRole, RemoveUserToRole } from '../../../../actions';
import { ProjectState } from '../../../../states';

@Component({
  standalone: true,
  template: `<wbs-project-roles
    [members]="members()"
    [approverIds]="approverIds()"
    [pmIds]="pmIds()"
    [smeIds]="smeIds()"
    [mustConfirm]="true"
    (addUserToRole)="add($event.role, $event.user)"
    (removeUserToRole)="remove($event.role, $event.user)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectRolesComponent],
})
export class ProjectSettingsRolesComponent {
  private readonly project = toSignal(this.store.select(ProjectState.current));
  private readonly roleIds = toSignal(this.store.select(RoleState.definitions));

  readonly members = toSignal(this.store.select(MembershipState.members));
  readonly approverIds = computed(() =>
    this.getUserIds(ROLES.APPROVER, this.roleIds(), this.project())
  );
  readonly pmIds = computed(() =>
    this.getUserIds(ROLES.PM, this.roleIds(), this.project())
  );
  readonly smeIds = computed(() =>
    this.getUserIds(ROLES.SME, this.roleIds(), this.project())
  );

  constructor(private readonly store: Store) {}

  add(role: string, user: Member) {
    this.store.dispatch(new AddUserToRole(role, user));
  }

  remove(role: string, user: Member) {
    this.store.dispatch(new RemoveUserToRole(role, user));
  }

  private getUserIds(
    roleName: string,
    roles: Role[] | undefined,
    project: Project | undefined
  ): string[] {
    const role = roles?.find((r) => r.name === roleName)?.id;
    return (
      project?.roles?.filter((r) => r.role === role).map((r) => r.userId) ?? []
    );
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Member } from '@wbs/core/models';
import { ProjectRolesComponent } from '@wbs/main/pages/projects/components/project-roles/project-roles.component';
import { MembershipState } from '@wbs/main/states';
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
  readonly members = toSignal(this.store.select(MembershipState.members));
  readonly approverIds = toSignal(this.store.select(ProjectState.approvers));
  readonly pmIds = toSignal(this.store.select(ProjectState.pms));
  readonly smeIds = toSignal(this.store.select(ProjectState.smes));

  constructor(private readonly store: Store) {}

  add(role: string, user: Member) {
    this.store.dispatch(new AddUserToRole(role, user));
  }

  remove(role: string, user: Member) {
    this.store.dispatch(new RemoveUserToRole(role, user));
  }
}

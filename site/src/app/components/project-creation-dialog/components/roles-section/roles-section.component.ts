import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  WritableSignal,
} from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectRolesComponent } from '@wbs/components/project-roles';
import { ROLES, User } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-roles-section',
  templateUrl: './roles-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectRolesComponent],
})
export class RolesSectionComponent {
  readonly faSpinner = faSpinner;
  readonly approvers = model.required<User[]>();
  readonly pms = model.required<User[]>();
  readonly smes = model.required<User[]>();
  readonly members = input.required<User[]>();
  readonly approvalEnabled = input.required<boolean>();

  add(role: string, user: User) {
    if (role === ROLES.APPROVER) {
      this.addUser(this.approvers, user);
    } else if (role === ROLES.PM) {
      this.addUser(this.pms, user);
    } else if (role === ROLES.SME) {
      this.addUser(this.smes, user);
    }
  }

  remove(role: string, user: User) {
    if (role === ROLES.APPROVER) {
      this.removeUser(this.approvers, user);
    } else if (role === ROLES.PM) {
      this.removeUser(this.pms, user);
    } else if (role === ROLES.SME) {
      this.removeUser(this.smes, user);
    }
  }

  private addUser(list: WritableSignal<User[]>, user: User) {
    list.set([...list(), user]);
  }

  private removeUser(list: WritableSignal<User[]>, user: User) {
    const list2 = list();
    const index = list2.findIndex((x) => x.userId === user.userId);

    if (index > -1) list2.splice(index, 1);

    list.set(list2);
  }
}

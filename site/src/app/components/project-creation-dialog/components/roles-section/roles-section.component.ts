import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  WritableSignal,
} from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectRolesComponent } from '@wbs/components/project-roles';
import { MetadataStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-roles-section',
  templateUrl: './roles-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectRolesComponent],
})
export class RolesSectionComponent {
  private readonly ids = inject(MetadataStore).roles.ids;

  readonly faSpinner = faSpinner;
  readonly approvers = model.required<UserViewModel[]>();
  readonly pms = model.required<UserViewModel[]>();
  readonly smes = model.required<UserViewModel[]>();
  readonly members = input.required<UserViewModel[]>();
  readonly approvalEnabled = input.required<boolean>();

  add(role: string, user: UserViewModel) {
    if (role === this.ids.approver) {
      this.addUser(this.approvers, user);
    } else if (role === this.ids.pm) {
      this.addUser(this.pms, user);
    } else if (role === this.ids.sme) {
      this.addUser(this.smes, user);
    }
  }

  remove(role: string, user: UserViewModel) {
    if (role === this.ids.approver) {
      this.removeUser(this.approvers, user);
    } else if (role === this.ids.pm) {
      this.removeUser(this.pms, user);
    } else if (role === this.ids.sme) {
      this.removeUser(this.smes, user);
    }
  }

  private addUser(list: WritableSignal<UserViewModel[]>, user: UserViewModel) {
    list.set([...list(), user]);
  }

  private removeUser(
    list: WritableSignal<UserViewModel[]>,
    user: UserViewModel
  ) {
    const list2 = list();
    const index = list2.findIndex((x) => x.userId === user.userId);

    if (index > -1) list2.splice(index, 1);

    list.set(list2);
  }
}

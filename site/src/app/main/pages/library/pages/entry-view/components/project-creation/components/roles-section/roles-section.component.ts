import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  WritableSignal,
} from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { Member } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { ProjectRolesComponent } from '@wbs/main/components/project-roles';
import { MetadataState } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-roles-section',
  templateUrl: './roles-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectRolesComponent],
})
export class RolesSectionComponent {
  private readonly store = inject(SignalStore);
  private readonly ids = inject(MetadataState).roles.ids;

  readonly faSpinner = faSpinner;
  readonly approverIds = model.required<string[]>();
  readonly pmIds = model.required<string[]>();
  readonly smeIds = model.required<string[]>();
  readonly members = input.required<Member[]>();
  readonly approvalEnabled = input.required<boolean>();

  add(role: string, user: string) {
    if (role === this.ids.approver) {
      this.addUser(this.approverIds, user);
    } else if (role === this.ids.pm) {
      this.addUser(this.pmIds, user);
    } else if (role === this.ids.sme) {
      this.addUser(this.smeIds, user);
    }
  }

  remove(role: string, user: string) {
    if (role === this.ids.approver) {
      this.removeUser(this.approverIds, user);
    } else if (role === this.ids.pm) {
      this.removeUser(this.pmIds, user);
    } else if (role === this.ids.sme) {
      this.removeUser(this.smeIds, user);
    }
  }

  private addUser(list: WritableSignal<string[]>, user: string) {
    list.set([...list(), user]);
  }

  private removeUser(list: WritableSignal<string[]>, user: string) {
    const list2 = list();
    const index = list2.indexOf(user);

    if (index > -1) list2.splice(index, 1);

    list.set(list2);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { RoleIds } from '@wbs/core/models';
import { ProjectRolesComponent } from '@wbs/main/pages/projects/components/project-roles/project-roles.component';
import { MembershipState, RolesState } from '@wbs/main/states';
import { RolesChosen } from '../../../actions';
import { ProjectCreateState } from '../../../states';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  standalone: true,
  selector: 'wbs-project-create-roles',
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, ProjectRolesComponent],
})
export class RolesComponent implements OnInit {
  readonly members = toSignal(this.store.select(MembershipState.members));

  readonly approverIds = signal<string[]>([]);
  readonly pmIds = signal<string[]>([]);
  readonly smeIds = signal<string[]>([]);

  constructor(private readonly store: Store) {}

  private get ids(): RoleIds {
    return this.store.selectSnapshot(RolesState.ids);
  }

  ngOnInit(): void {
    const roles = this.store.selectSnapshot(ProjectCreateState.roles);

    this.approverIds.set(roles.get(this.ids.approver) ?? []);
    this.pmIds.set(roles.get(this.ids.pm) ?? []);
    this.smeIds.set(roles.get(this.ids.sme) ?? []);
  }

  nav(): void {
    const roles = new Map<string, string[]>();

    roles.set(this.ids.approver, this.approverIds());
    roles.set(this.ids.pm, this.pmIds());
    roles.set(this.ids.sme, this.smeIds());

    this.store.dispatch(new RolesChosen(roles));
  }

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

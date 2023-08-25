import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ROLES, ROLES_TYPE } from '@wbs/core/models';
import { ProjectRolesComponent } from '@wbs/main/pages/projects/components/project-roles/project-roles.component';
import { MembershipState } from '@wbs/main/states';
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

  ngOnInit(): void {
    const roles = this.store.selectSnapshot(ProjectCreateState.roles);

    this.approverIds.set(this.getIds(roles, ROLES.APPROVER));
    this.pmIds.set(this.getIds(roles, ROLES.PM));
    this.smeIds.set(this.getIds(roles, ROLES.SME));
  }

  nav(): void {
    const roles = new Map<ROLES_TYPE, string[]>();

    roles.set(ROLES.APPROVER, this.approverIds());
    roles.set(ROLES.PM, this.pmIds());
    roles.set(ROLES.SME, this.smeIds());

    this.store.dispatch(new RolesChosen(roles));
  }

  add(role: string, user: string) {
    if (role === ROLES.APPROVER) {
      this.addUser(this.approverIds, user);
    } else if (role === ROLES.PM) {
      this.addUser(this.pmIds, user);
    } else if (role === ROLES.SME) {
      this.addUser(this.smeIds, user);
    }
  }

  remove(role: string, user: string) {
    if (role === ROLES.APPROVER) {
      this.removeUser(this.approverIds, user);
    } else if (role === ROLES.PM) {
      this.removeUser(this.pmIds, user);
    } else if (role === ROLES.SME) {
      this.removeUser(this.smeIds, user);
    }
  }

  private getIds(
    roles: Map<ROLES_TYPE, string[]> | undefined,
    role: ROLES_TYPE
  ): string[] {
    return roles?.get(role) ?? [];
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

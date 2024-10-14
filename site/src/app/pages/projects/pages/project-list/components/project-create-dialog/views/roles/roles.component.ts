import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { ProjectRolesComponent } from '@wbs/components/project-roles';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ROLES, User } from '@wbs/core/models';
import { MembershipStore } from '@wbs/core/store';
import { ProjectCreateStore } from '../../project-create.store';

@Component({
  standalone: true,
  selector: 'wbs-project-create-roles',
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    FontAwesomeModule,
    ProjectRolesComponent,
    TranslateModule,
  ],
})
export class ProjectCreateRolesComponent implements OnInit {
  readonly faSpinner = faSpinner;
  readonly store = inject(ProjectCreateStore);
  readonly membership = inject(MembershipStore).membership;

  readonly isLoading = signal<boolean>(true);
  readonly members = signal<User[]>([]);
  readonly approvalEnabled = inject(MembershipStore).projectApprovalRequired;

  constructor(private readonly data: DataServiceFactory) {}

  ngOnInit(): void {
    this.data.memberships
      .getMembershipUsersAsync(this.membership()!.id)
      .subscribe((members) => {
        this.members.set(members);
        this.isLoading.set(false);
      });
  }

  add(role: string, user: User) {
    if (role === ROLES.APPROVER) {
      this.addUser(this.store.approvers, user);
    } else if (role === ROLES.PM) {
      this.addUser(this.store.pms, user);
    } else if (role === ROLES.SME) {
      this.addUser(this.store.smes, user);
    }
  }

  remove(role: string, user: User) {
    if (role === ROLES.APPROVER) {
      this.removeUser(this.store.approvers, user);
    } else if (role === ROLES.PM) {
      this.removeUser(this.store.pms, user);
    } else if (role === ROLES.SME) {
      this.removeUser(this.store.smes, user);
    }
  }

  private addUser(list: WritableSignal<User[]>, user: User) {
    list.set([...list(), user]);
  }

  private removeUser(list: WritableSignal<User[]>, user: User) {
    const list2 = list();
    const index = list2.findIndex((u) => u.userId === user.userId);

    if (index > -1) list2.splice(index, 1);

    list.set(list2);
  }
}

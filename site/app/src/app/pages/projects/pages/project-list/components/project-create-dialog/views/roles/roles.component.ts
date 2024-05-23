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
import { Member } from '@wbs/core/models';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
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
  private readonly ids = inject(MetadataStore).roles.ids;
  private readonly org = inject(MembershipStore).organization;

  readonly faSpinner = faSpinner;
  readonly store = inject(ProjectCreateStore);

  readonly isLoading = signal<boolean>(true);
  readonly members = signal<Member[]>([]);
  readonly approvalEnabled = inject(MembershipStore).projectApprovalRequired;

  constructor(private readonly data: DataServiceFactory) {}

  ngOnInit(): void {
    this.data.memberships
      .getMembershipUsersAsync(this.org()!.name)
      .subscribe((members) => {
        this.members.set(members);
        this.isLoading.set(false);
      });
  }

  add(role: string, user: string) {
    if (role === this.ids.approver) {
      this.addUser(this.store.approverIds, user);
    } else if (role === this.ids.pm) {
      this.addUser(this.store.pmIds, user);
    } else if (role === this.ids.sme) {
      this.addUser(this.store.smeIds, user);
    }
  }

  remove(role: string, user: string) {
    if (role === this.ids.approver) {
      this.removeUser(this.store.approverIds, user);
    } else if (role === this.ids.pm) {
      this.removeUser(this.store.pmIds, user);
    } else if (role === this.ids.sme) {
      this.removeUser(this.store.smeIds, user);
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

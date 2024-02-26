import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, RoleIds } from '@wbs/core/models';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { ProjectRolesComponent } from '@wbs/main/pages/projects/components/project-roles/project-roles.component';
import { AuthState, MembershipState, RoleState } from '@wbs/main/states';
import { forkJoin } from 'rxjs';
import { RolesChosen } from '../../actions';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';
import { SignalStore } from '@wbs/core/services';

@Component({
  standalone: true,
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    ProjectRolesComponent,
    TranslateModule,
    WizardFooterComponent,
  ],
})
export class RolesComponent implements OnInit {
  readonly faSpinner = faSpinner;
  readonly isLoading = signal<boolean>(true);
  readonly members = signal<Member[]>([]);
  readonly approverIds = signal<string[]>([]);
  readonly pmIds = signal<string[]>([]);
  readonly smeIds = signal<string[]>([]);
  readonly org = input.required<string>();
  readonly orgObj = this.store.select(MembershipState.organization);
  readonly approvalEnabled = computed(
    () => this.orgObj()?.metadata?.projectApprovalRequired ?? false
  );

  constructor(
    private readonly data: DataServiceFactory,
    private readonly service: ProjectCreateService,
    private readonly store: SignalStore
  ) {}

  private get ids(): RoleIds {
    return this.store.selectSnapshot(RoleState.ids)!;
  }

  ngOnInit(): void {
    forkJoin({
      members: this.data.memberships.getMembershipUsersAsync(this.org()),
      roles: this.store.selectOnceAsync(ProjectCreateState.roles),
      userId: this.store.selectOnceAsync(AuthState.userId),
    }).subscribe(({ members, roles, userId }) => {
      this.members.set(members);

      this.pmIds.set(roles.get(this.ids.pm) ?? [userId!]);
      this.smeIds.set(roles.get(this.ids.sme) ?? []);
      this.approverIds.set(roles.get(this.ids.approver) ?? []);
      this.isLoading.set(false);
    });
  }

  back(): void {
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.DISCIPLINES);
  }

  continue(): void {
    const roles = new Map<string, string[]>();

    roles.set(this.ids.approver, this.approverIds());
    roles.set(this.ids.pm, this.pmIds());
    roles.set(this.ids.sme, this.smeIds());

    this.store.dispatch(new RolesChosen(roles));
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.SAVING);
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

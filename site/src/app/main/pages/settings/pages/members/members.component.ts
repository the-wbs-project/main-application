import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Role } from '@wbs/core/models';
import { DataServiceFactory } from '@wbs/core/data-services';
import { MembershipState, RoleState } from '@wbs/main/states';
import { first, forkJoin, skipWhile } from 'rxjs';
import { ChangeBreadcrumbs } from '../../actions';
import { Breadcrumb } from '../../models';
import { InvitationListComponent } from './components/invitation-list/invitation-list.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { RoleFilterListComponent } from './components/role-filter-list/role-filter-list.component';
import { MembershipAdminUiService } from './services';
import { InviteViewModel, MemberViewModel } from '@wbs/core/view-models';

const ROLES = [
  {
    name: 'all',
    text: 'OrgSettings.AllRoles',
  },
  {
    name: 'pm',
    text: 'General.PMs',
  },
  {
    name: 'approver',
    text: 'General.Approvers',
  },
  {
    name: 'sme',
    text: 'General.SMEs',
  },
  {
    name: 'admin',
    text: 'General.Admin',
  },
];

@Component({
  standalone: true,
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    FontAwesomeModule,
    FormsModule,
    InvitationListComponent,
    MemberListComponent,
    NgClass,
    RoleFilterListComponent,
    TranslateModule,
  ],
})
export class MembersComponent implements OnInit {
  readonly org = input.required<string>();

  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly organization = toSignal(
    this.store.select(MembershipState.organization)
  );
  readonly isLoading = signal<boolean>(true);
  readonly members = signal<MemberViewModel[]>([]);
  readonly invites = signal<InviteViewModel[]>([]);
  readonly roles = signal<any[]>([]);
  readonly roleDefinitions = signal<Role[]>([]);
  readonly capacity = computed(() => this.organization()?.metadata?.seatCount);
  readonly remaining = computed(() =>
    this.capacity()
      ? (this.capacity() ?? 0) - this.members().length - this.invites().length
      : undefined
  );
  readonly canAdd = computed(() => {
    const r = this.remaining();

    return r === undefined || r > 0;
  });
  readonly roleFilters = signal<string[]>([]);
  readonly view = signal<'members' | 'invitations'>('members');
  readonly faPlus = faPlus;
  readonly faSpinner = faSpinner;

  textFilter = '';

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store,
    private readonly uiService: MembershipAdminUiService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeBreadcrumbs(this.crumbs));

    this.store
      .select(RoleState.definitions)
      .pipe(
        skipWhile((list) => list == undefined),
        first()
      )
      .subscribe((definitions) => {
        if (!definitions) return;

        for (const role of ROLES) {
          if (role.name === 'all') continue;

          role.name = definitions.find((x) => x.name === role.name)!.id;
        }
        this.roles.set(ROLES);
        this.roleDefinitions.set(definitions);
      });
    const org = this.org();

    forkJoin({
      members: this.data.memberships.getMembershipUsersAsync(org),
      invites: this.data.memberships.getInvitesAsync(org),
    }).subscribe(({ members, invites }) => {
      this.members.set(
        members.map((m) => {
          return {
            ...m,
            roleList: m.roles.join(','),
          };
        })
      );
      this.invites.set(
        invites.map((i) => {
          return {
            ...i,
            roleList: i.roles.join(','),
          };
        })
      );
      this.isLoading.set(false);
    });
  }

  openInviteDialog() {
    this.uiService
      .openNewInviteDialog(
        this.org(),
        this.invites(),
        this.members(),
        this.roleDefinitions()
      )
      .subscribe((invites) => {
        if (!invites) return;

        this.invites.set([
          ...invites.map((i) => {
            return {
              ...i,
              roleList: i.roles.join(','),
            };
          }),
          ...this.invites(),
        ]);
      });
  }
}

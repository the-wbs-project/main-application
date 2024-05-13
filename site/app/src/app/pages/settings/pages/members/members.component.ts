import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { SignalStore } from '@wbs/core/services';
import { InviteViewModel, MemberViewModel } from '@wbs/core/view-models';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/store';
import { forkJoin } from 'rxjs';
import { ChangeBreadcrumbs } from '../../actions';
import { Breadcrumb } from '../../models';
import { InvitationFormComponent } from './components/invitation-form';
import { InvitationListComponent } from './components/invitation-list';
import { MemberListComponent } from './components/member-list';
import { RoleFilterListComponent } from './components/role-filter-list';
import { MembershipAdminService } from './services';

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
    InvitationFormComponent,
    InvitationListComponent,
    MemberListComponent,
    NgClass,
    RoleFilterListComponent,
    TranslateModule,
  ],
})
export class MembersComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly memberService = inject(MembershipAdminService);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(SignalStore);
  private readonly profile = inject(UserStore).profile;
  private readonly organization = inject(MembershipStore).organization;

  readonly org = input.required<string>();

  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly isLoading = signal(true);
  readonly members = signal<MemberViewModel[]>([]);
  readonly invites = signal<InviteViewModel[]>([]);
  readonly showInviteDialog = model(false);

  readonly roles = this.processRoles();
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

  ngOnInit(): void {
    this.store.dispatch(new ChangeBreadcrumbs(this.crumbs));

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

  sendInvite({ emails, roles }: { roles: string[]; emails: string[] }): void {
    const name = this.profile()!.name;

    this.memberService
      .sendInvitesAsync(this.org(), emails, roles, name)
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
    //This function is used to send an invite to a user
  }

  private processRoles(): { name: string; text: string }[] {
    const definitions = this.metadata.roles.definitions;

    for (const role of ROLES) {
      if (role.name === 'all') continue;

      role.name = definitions.find((x) => x.name === role.name)!.id;
    }
    return ROLES;
  }
}

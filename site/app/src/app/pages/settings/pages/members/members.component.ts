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
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { DataServiceFactory } from '@wbs/core/data-services';
import { SignalStore } from '@wbs/core/services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import { InviteViewModel, MemberViewModel } from '@wbs/core/view-models';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChangeBreadcrumbs } from '../../actions';
import { Breadcrumb } from '../../models';
import {
  InvitationFormComponent,
  InvitationListComponent,
  MemberListComponent,
  MembershipRollupComponent,
  RoleFilterListComponent,
} from './components';
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
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    InvitationFormComponent,
    InvitationListComponent,
    MemberListComponent,
    MembershipRollupComponent,
    NgClass,
    RoleFilterListComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class MembersComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly memberService = inject(MembershipAdminService);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(SignalStore);
  private readonly profile = inject(UserStore).profile;

  readonly org = input.required<string>();
  readonly organization = inject(MembershipStore).organization;

  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly isLoading = signal(true);
  readonly members = model<MemberViewModel[]>();
  readonly invites = model<InviteViewModel[]>();

  readonly roles = this.processRoles();
  readonly capacity = computed(() => this.organization()?.metadata?.seatCount);
  readonly remaining = computed(() =>
    this.capacity()
      ? (this.capacity() ?? 0) -
        (this.members()?.length ?? 0) -
        (this.invites()?.length ?? 0)
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

  startInvite(): void {
    InvitationFormComponent.launchAsync(
      this.dialog,
      this.invites() ?? [],
      this.members() ?? [],
      this.metadata.roles.definitions
    )
      .pipe(
        switchMap((results) => {
          if (!results) return of(undefined);

          const name = this.profile()!.name;

          return this.memberService.sendInvitesAsync(
            this.org(),
            results.emails,
            results.roles,
            name
          );
        })
      )
      .subscribe((invites) => {
        if (!invites) return;

        this.invites.update((list) => [
          ...invites.map((i) => ({
            ...i,
            roleList: i.roles.join(','),
          })),
          ...(list ?? []),
        ]);
      });
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

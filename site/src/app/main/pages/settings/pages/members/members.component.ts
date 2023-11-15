import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { gearIcon, plusIcon } from '@progress/kendo-svg-icons';
import { DialogService } from '@wbs/main/services';
import { MembershipState, RoleState } from '@wbs/main/states';
import { first, skipWhile } from 'rxjs';
import { ChangeBreadcrumbs } from '../../actions';
import { Breadcrumb } from '../../models';
import { InvitationListComponent } from './components/invitation-list/invitation-list.component';
import { InvitesFormComponent } from './components/invites-form/invites-form.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { RoleFilterListComponent } from './components/role-filter-list/role-filter-list.component';
import { MembershipAdminState } from './states';
import { Member } from '@wbs/core/models';

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
    DropDownListModule,
    FormsModule,
    MemberListComponent,
    NgClass,
    NgIf,
    RoleFilterListComponent,
    RouterModule,
    SVGIconModule,
    TranslateModule,
    InvitationListComponent,
  ],
})
export class MembersComponent implements OnInit {
  @Input() org!: string;
  @Input() members!: Member[];

  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly organization = toSignal(
    this.store.select(MembershipState.organization)
  );
  readonly invites = toSignal(
    this.store.select(MembershipAdminState.invitations)
  );
  readonly roles = signal<any[]>([]);
  readonly inviteCount = computed(() => this.invites()?.length ?? 0);
  readonly capacity = computed(() => this.organization()?.metadata?.seatCount);
  readonly remaining = computed(() =>
    this.capacity()
      ? (this.capacity() ?? 0) - this.members.length - this.inviteCount()
      : undefined
  );
  readonly roleFilters = signal<string[]>([]);
  readonly view = signal<'members' | 'invitations'>('members');
  readonly gearIcon = gearIcon;
  readonly plusIcon = plusIcon;

  textFilter = '';

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store
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
      });
  }

  openInviteDialog() {
    const dialog = this.dialogService.openDialog(
      InvitesFormComponent,
      {
        size: 'lg',
      },
      this.members
    );
  }
}

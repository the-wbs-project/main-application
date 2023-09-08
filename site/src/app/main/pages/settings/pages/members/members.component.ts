import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
import { MembershipState } from '@wbs/main/states';
import { ChangeBreadcrumbs } from '../../actions';
import { Breadcrumb } from '../../models';
import { MemberListComponent } from './components/member-list/member-list.component';
import { InvitationListComponent } from './components/invitation-list/invitation-list.component';

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
    RouterModule,
    SVGIconModule,
    TranslateModule,
    InvitationListComponent,
  ],
})
export class MembersComponent implements OnInit {
  @Input() org!: string;
  @Input() view!: 'members' | 'invitations';

  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly members = toSignal(this.store.select(MembershipState.members));
  readonly gearIcon = gearIcon;
  readonly plusIcon = plusIcon;
  readonly roles = ROLES;

  role = 'all';
  textFilter = '';

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeBreadcrumbs(this.crumbs));
    this.store
      .select(MembershipState.members)
      .subscribe(() => console.log('changed!'));
  }
}

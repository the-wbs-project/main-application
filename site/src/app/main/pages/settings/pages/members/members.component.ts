import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import {
  gearIcon,
  pencilIcon,
  plusIcon,
  xIcon,
} from '@progress/kendo-svg-icons';
import { Member } from '@wbs/core/models';
import { RemoveMemberFromOrganization } from '@wbs/main/actions';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { DialogService } from '@wbs/main/services';
import { MembershipState } from '@wbs/main/states';
import { first } from 'rxjs/operators';
import { ChangeBreadcrumbs } from '../../actions';
import { UserActionsComponent } from '../../components/user-actions/user-actions.component';
import { Breadcrumb } from '../../models';
import { EditMemberComponent } from './components/edit-member/edit-member.component';
import { SortArrowComponent } from './components/sort-arrow.component';
import { TableHelper } from './table-helper.service';
import { TableProcessPipe } from './table-process.pipe';
import { SortableDirective } from './table-sorter.directive';

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

const actionMenu: any[] = [
  {
    text: 'General.Edit',
    svgIcon: pencilIcon,
    action: 'edit',
  },
  {
    text: 'General.Remove',
    svgIcon: xIcon,
    action: 'remove',
  },
];

@Component({
  standalone: true,
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownButtonModule,
    DropDownListModule,
    EditMemberComponent,
    FormsModule,
    NgClass,
    NgIf,
    NgFor,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    SVGIconModule,
    TableProcessPipe,
    TranslateModule,
    UserActionsComponent,
  ],
  providers: [TableHelper],
})
export class MembersComponent implements OnInit {
  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly members = toSignal(this.store.select(MembershipState.members));
  readonly state = signal(<State>{
    sort: [{ field: 'name', dir: 'asc' }],
  });
  readonly gearIcon = gearIcon;
  readonly plusIcon = plusIcon;
  readonly menu = actionMenu;
  readonly roles = ROLES;

  role = 'all';
  textFilter = '';

  constructor(
    private readonly dialogService: DialogService,
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeBreadcrumbs(this.crumbs));
  }

  userActionClicked(member: Member, action: string): void {
    if (action === 'edit') {
      const ref = this.modalService.open(EditMemberComponent, {
        size: 'lg',
        centered: true,
      });

      ref.componentInstance.member = structuredClone(member);

      ref.closed.subscribe((member) => {
        console.log(member);
      });
    } else if (action === 'remove') {
      this.dialogService
        .confirm('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
        .pipe(first())
        .subscribe((answer) => {
          if (answer) {
            this.store.dispatch(new RemoveMemberFromOrganization(member.id));
          }
        });
    }
  }

  updateState(): void {
    const state = <State>{
      sort: this.state().sort,
    };
    const filters: (CompositeFilterDescriptor | FilterDescriptor)[] = [];

    if (this.textFilter) {
      filters.push(<CompositeFilterDescriptor>{
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: this.textFilter,
          },
          {
            field: 'email',
            operator: 'contains',
            value: this.textFilter,
          },
        ],
      });
    }
    if (this.role !== 'all') {
      filters.push({
        field: 'roles',
        operator: 'contains',
        value: this.role,
      });
    }
    state.filter = {
      logic: 'and',
      filters,
    };
    console.log(state);
    this.state.set(state);
  }
}

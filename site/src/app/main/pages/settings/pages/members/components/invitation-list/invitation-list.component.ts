import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { gearIcon, pencilIcon, xIcon } from '@progress/kendo-svg-icons';
import { Invite, Member } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { DialogService } from '@wbs/main/services';
import { SortableDirective } from '../../directives/table-sorter.directive';
import { TableProcessPipe } from '../../pipes/table-process.pipe';
import { TableHelper } from '../../services';
import { SortArrowComponent } from '../sort-arrow.component';

@Component({
  standalone: true,
  selector: 'wbs-invitation-list',
  templateUrl: './invitation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableHelper],
  imports: [
    DropDownButtonModule,
    NgClass,
    NgFor,
    NgIf,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    SVGIconModule,
    TableProcessPipe,
    TranslateModule,
  ],
})
export class InvitationListComponent implements OnChanges {
  @Input({ required: true }) invites?: Invite[];
  @Input() role = '';
  @Input() textFilter = '';

  readonly state = signal(<State>{
    sort: [{ field: 'name', dir: 'asc' }],
  });
  readonly gearIcon = gearIcon;
  readonly menu = [
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

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store
  ) {}

  ngOnChanges(): void {
    this.updateState();
  }

  userActionClicked(member: Member, action: string): void {
    /* if (action === 'edit') {
      this.dialogService
        .openDialog<Member>(
          EditMemberComponent,
          {
            size: 'lg',
          },
          structuredClone(member)
        )
        .subscribe((changedMember) => {
          if (!changedMember) return;

          this.store.dispatch(
            new UpdateMemberRoles(changedMember.id, changedMember.roles)
          );
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
    }*/
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
    this.state.set(state);
  }
}

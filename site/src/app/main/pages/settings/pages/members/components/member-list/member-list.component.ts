import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import {
  faGear,
  faPencil,
  faPlus,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Member } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { SortArrowComponent } from '@wbs/main/components/sort-arrow.component';
import { SortableDirective } from '@wbs/main/directives/table-sorter.directive';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { TableProcessPipe } from '@wbs/main/pipes/table-process.pipe';
import { DialogService, TableHelper } from '@wbs/main/services';
import { first } from 'rxjs/operators';
import { RemoveMemberFromOrganization, UpdateMemberRoles } from '../../actions';
import { EditMemberComponent } from '../edit-member/edit-member.component';

@Component({
  standalone: true,
  selector: 'wbs-member-list',
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    DateTextPipe,
    NgFor,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    SVGIconModule,
    TableProcessPipe,
    TranslateModule,
  ],
})
export class MemberListComponent implements OnChanges {
  @Input() members?: Member[];
  @Input() roles: string[] = [];
  @Input() textFilter = '';

  readonly state = signal(<State>{
    sort: [{ field: 'lastLogin', dir: 'desc' }],
  });
  readonly faGear = faGear;
  readonly faPlus = faPlus;
  readonly menu = [
    {
      text: 'General.Edit',
      icon: faPencil,
      action: 'edit',
    },
    {
      text: 'General.Remove',
      icon: faX,
      action: 'remove',
    },
  ];

  constructor(
    private readonly dialogService: DialogService,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  ngOnChanges(): void {
    this.updateState();
  }

  userActionClicked(member: Member, action: string): void {
    if (action === 'edit') {
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
      this.messages.confirm
        .show('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
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
    if (this.roles.length > 0) {
      const roleFilter: CompositeFilterDescriptor = {
        logic: 'or',
        filters: [],
      };

      for (const role of this.roles) {
        roleFilter.filters.push({
          field: 'roleList',
          operator: 'contains',
          value: role.toString(),
        });
      }
      filters.push(roleFilter);
    }
    state.filter = {
      logic: 'and',
      filters,
    };
    this.state.set(state);
  }
}

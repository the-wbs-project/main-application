import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';
import {
  faGear,
  faPencil,
  faPlus,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Member, Role } from '@wbs/core/models';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { SortArrowComponent } from '@wbs/main/components/sort-arrow.component';
import { SortableDirective } from '@wbs/main/directives/table-sorter.directive';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { TableProcessPipe } from '@wbs/main/pipes/table-process.pipe';
import { TableHelper } from '@wbs/main/services';
import { MembershipAdminUiService } from '../../services';

@Component({
  standalone: true,
  selector: 'wbs-member-list',
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    DateTextPipe,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    TableProcessPipe,
    TranslateModule,
  ],
})
export class MemberListComponent implements OnChanges {
  @Input({ required: true }) members!: Member[];
  @Input({ required: true }) org!: string;
  @Input({ required: true }) roles!: Role[];
  @Input() filteredRoles: string[] = [];
  @Input() textFilter = '';
  @Output() readonly membersChanged = new EventEmitter<Member[]>();

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

  constructor(private readonly uiService: MembershipAdminUiService) {}

  ngOnChanges(): void {
    this.updateState();
  }

  userActionClicked(member: Member, action: string): void {
    if (action === 'edit') {
      this.openEditDialog(member);
    } else if (action === 'remove') {
      this.openRemoveDialog(member);
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
    if (this.filteredRoles.length > 0) {
      const roleFilter: CompositeFilterDescriptor = {
        logic: 'or',
        filters: [],
      };

      for (const role of this.filteredRoles) {
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

  private openEditDialog(member: Member): void {
    this.uiService
      .openEditMemberDialog(this.org, member, this.roles)
      .subscribe((changedMember) => {
        if (!changedMember) return;

        const index = this.members.findIndex((m) => m.id === member.id);
        this.members[index] = changedMember;

        this.membersChanged.emit(this.members);
      });
  }

  private openRemoveDialog(member: Member): void {
    this.uiService
      .openRemoveMemberDialog(this.org, member.id)
      .subscribe((answer) => {
        if (!answer) return;

        const index = this.members.findIndex((m) => m.id === member.id);
        this.members.splice(index, 1);

        this.membersChanged.emit(this.members);
      });
  }
}

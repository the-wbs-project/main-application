import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';
import { faGear, faX } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { InviteViewModel } from '@wbs/core/view-models';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { SortArrowComponent } from '@wbs/main/components/sort-arrow.component';
import { SortableDirective } from '@wbs/main/directives/table-sorter.directive';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { TableProcessPipe } from '@wbs/main/pipes/table-process.pipe';
import { TableHelper } from '@wbs/main/services';
import { MembershipAdminUiService } from '../../services';
import { IsExpiredPipe } from './is-expired.pipe';

@Component({
  standalone: true,
  selector: 'wbs-invitation-list',
  templateUrl: './invitation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    DateTextPipe,
    IsExpiredPipe,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    TableProcessPipe,
    TranslateModule,
  ],
})
export class InvitationListComponent implements OnChanges {
  @Input({ required: true }) invites!: InviteViewModel[];
  @Input({ required: true }) org!: string;
  @Input() filteredRoles: string[] = [];
  @Input() textFilter = '';
  @Output() readonly invitesChanged = new EventEmitter<InviteViewModel[]>();

  readonly state = signal(<State>{
    sort: [{ field: 'name', dir: 'asc' }],
  });
  readonly faGear = faGear;
  readonly menu = [
    {
      text: 'OrgSettings.CancelInvite',
      icon: faX,
      action: 'cancel',
    },
  ];

  constructor(private readonly uiService: MembershipAdminUiService) {}

  ngOnChanges(): void {
    this.updateState();
  }

  userActionClicked(invite: InviteViewModel, action: string): void {
    if (action === 'cancel') {
      this.openCancelDialog(invite);
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
            field: 'inviter',
            operator: 'contains',
            value: this.textFilter,
          },
          {
            field: 'invitee',
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

  private openCancelDialog(invite: InviteViewModel): void {
    this.uiService
      .openCancelInviteDialog(this.org, invite.id)
      .subscribe((answer) => {
        if (!answer) return;

        const index = this.invites.findIndex((i) => i.id === invite.id);
        this.invites.splice(index, 1);

        this.invitesChanged.emit(this.invites);
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
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
export class InvitationListComponent {
  readonly invites = model.required<InviteViewModel[]>();
  readonly org = input.required<string>();
  readonly filteredRoles = input<string[]>([]);
  readonly textFilter = input<string>('');
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

  constructor(private readonly uiService: MembershipAdminUiService) {
    effect(() => this.updateState(this.textFilter(), this.filteredRoles()));
  }

  userActionClicked(invite: InviteViewModel, action: string): void {
    if (action === 'cancel') {
      this.openCancelDialog(invite);
    }
  }

  updateState(textFilter: string, filteredRoles: string[]): void {
    const state = <State>{
      sort: this.state().sort,
    };
    const filters: (CompositeFilterDescriptor | FilterDescriptor)[] = [];

    if (textFilter) {
      filters.push(<CompositeFilterDescriptor>{
        logic: 'or',
        filters: [
          {
            field: 'inviter',
            operator: 'contains',
            value: textFilter,
          },
          {
            field: 'invitee',
            operator: 'contains',
            value: textFilter,
          },
        ],
      });
    }
    if (filteredRoles.length > 0) {
      const roleFilter: CompositeFilterDescriptor = {
        logic: 'or',
        filters: [],
      };

      for (const role of filteredRoles) {
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
      .openCancelInviteDialog(this.org(), invite.id)
      .subscribe((answer) => {
        if (!answer) return;

        this.invites.update((invites) => {
          const index = invites.findIndex((i) => i.id === invite.id);
          invites.splice(index, 1);
          return invites;
        });
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { faEnvelopeOpen, faGear, faX } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { ActionIconListComponent } from '@wbs/components/_utils/action-icon-list.component';
import { SortArrowComponent } from '@wbs/components/_utils/sort-arrow.component';
import { SortableDirective } from '@wbs/core/directives/table-sorter.directive';
import { Messages, TableHelper } from '@wbs/core/services';
import { InviteViewModel } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { MembershipService, MembershipSettingStore } from '../../services';

@Component({
  standalone: true,
  selector: 'wbs-invitation-list',
  templateUrl: './invitation-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    DateTextPipe,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    TranslateModule,
  ],
})
export class InvitationListComponent {
  private readonly messages = inject(Messages);
  private readonly service = inject(MembershipService);
  private readonly tableHelper = inject(TableHelper);

  readonly store = inject(MembershipSettingStore);
  readonly filteredRoles = input<string[]>([]);
  readonly textFilter = input<string>('');
  readonly sort = signal<SortDescriptor[]>([{ field: 'name', dir: 'asc' }]);
  readonly filter = computed(() =>
    this.createFilter(this.textFilter(), this.filteredRoles())
  );
  readonly data = computed(() =>
    this.tableHelper.process(this.store.invites() ?? [], {
      sort: this.sort(),
      filter: this.filter(),
    })
  );
  readonly faGear = faGear;
  readonly menu = [
    {
      text: 'OrgSettings.ResendInvite',
      icon: faEnvelopeOpen,
      action: 'resend',
    },
    {
      text: 'OrgSettings.CancelInvite',
      icon: faX,
      action: 'cancel',
    },
  ];

  actionClicked(invite: InviteViewModel, action: string): void {
    if (action === 'cancel') {
      this.cancelInvite(invite);
    } else if (action === 'resend') {
      this.service.resendInviteAsync(invite);
    }
  }

  private cancelInvite(invite: InviteViewModel): void {
    this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.CancelInviteConfirm')
      .subscribe((answer) => {
        if (!answer) return;

        this.service.cancelInviteAsync(invite.id);
      });
  }

  createFilter(
    textFilter: string,
    filteredRoles: string[]
  ): CompositeFilterDescriptor {
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
    return {
      logic: 'and',
      filters,
    };
  }
}

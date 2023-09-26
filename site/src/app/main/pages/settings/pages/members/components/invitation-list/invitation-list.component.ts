import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { faGear, faX } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Invite } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { first } from 'rxjs';
import { CancelInvite } from '../../actions';
import { SortableDirective } from '../../directives/table-sorter.directive';
import { TableProcessPipe } from '../../pipes/table-process.pipe';
import { TableHelper } from '../../services';
import { SortArrowComponent } from '../sort-arrow.component';
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
  @Input() roles: string[] = [];
  @Input() textFilter = '';

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

  constructor(
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  ngOnChanges(): void {
    this.updateState();
  }

  userActionClicked(invite: Invite, action: string): void {
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
    } else */ if (action === 'cancel') {
      this.messages.confirm
        .show('General.Confirmation', 'OrgSettings.CancelInviteConfirm')
        .pipe(first())
        .subscribe((answer) => {
          if (answer) {
            this.store.dispatch(new CancelInvite(invite.id));
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

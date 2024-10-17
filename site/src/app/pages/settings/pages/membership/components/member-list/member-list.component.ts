import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { faGear, faPencil, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { ActionIconListComponent } from '@wbs/components/_utils/action-icon-list.component';
import { SortArrowComponent } from '@wbs/components/_utils/sort-arrow.component';
import { SortableDirective } from '@wbs/core/directives/table-sorter.directive';
import { User } from '@wbs/core/models';
import { Messages, TableHelper } from '@wbs/core/services';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { MembershipService, MembershipSettingStore } from '../../services';
import { EditMemberComponent } from '../edit-member/edit-member.component';

const EDIT_MENU_ITEM = {
  text: 'General.Edit',
  icon: faPencil,
  action: 'edit',
};
const REMOVE_MENU_ITEM = {
  text: 'General.Edit',
  icon: faPencil,
  action: 'edit',
};

@Component({
  standalone: true,
  selector: 'wbs-member-list',
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MembershipService, TableHelper],
  imports: [
    ActionIconListComponent,
    DateTextPipe,
    DialogModule,
    EditMemberComponent,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    TranslateModule,
  ],
})
export class MemberListComponent {
  private readonly dialog = inject(DialogService);
  private readonly memberService = inject(MembershipService);
  private readonly messages = inject(Messages);
  private readonly store = inject(MembershipSettingStore);
  private readonly tableHelper = inject(TableHelper);

  readonly faGear = faGear;
  readonly faPlus = faPlus;
  //
  //  Inputs
  //
  readonly filteredRoles = input<string[]>([]);
  readonly textFilter = input<string>('');
  //
  //  Models
  //
  readonly sort = signal<SortDescriptor[]>([
    { field: 'lastLogin', dir: 'desc' },
  ]);
  //
  //  Computed
  //
  readonly filter = computed(() =>
    this.createFilter(this.textFilter(), this.filteredRoles())
  );
  readonly data = computed(() =>
    this.tableHelper.process(this.store.members() ?? [], {
      sort: this.sort(),
      filter: this.filter(),
    })
  );
  readonly menu = computed(() => {
    const list = [];

    if (this.store.hasUpdateAccess()) list.push(EDIT_MENU_ITEM);
    if (this.store.hasDeleteAccess()) list.push(REMOVE_MENU_ITEM);

    return list;
  });

  userActionClicked(member: User, action: string): void {
    if (action === 'edit') {
      this.launchEdit(member);
    } else if (action === 'remove') {
      this.openRemoveDialog(member);
    }
  }

  private createFilter(
    textFilter: string,
    filteredRoles: string[]
  ): CompositeFilterDescriptor {
    const filters: (CompositeFilterDescriptor | FilterDescriptor)[] = [];

    if (textFilter) {
      filters.push(<CompositeFilterDescriptor>{
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: textFilter,
          },
          {
            field: 'email',
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

  launchEdit(member: User): void {
    EditMemberComponent.launchAsync(
      this.dialog,
      structuredClone(member)
    ).subscribe((results) => {
      if (results == undefined) return;

      this.memberService.updateMemberRolesAsync(member, results.roles);
    });
  }

  private openRemoveDialog(member: User): void {
    this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
      .subscribe((answer) => {
        if (!answer) return;

        this.memberService.removeMemberAsync(member.userId);
      });
  }
}

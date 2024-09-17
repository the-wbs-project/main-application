import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  faGear,
  faPencil,
  faPlus,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
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
import { Messages, TableHelper } from '@wbs/core/services';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { MemberSettingsService } from '../../services';
import { MembersSettingStore } from '../../store';
import { EditMemberComponent } from '../edit-member';
import { UserViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-member-list',
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MemberSettingsService, TableHelper],
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
  private readonly memberService = inject(MemberSettingsService);
  private readonly messages = inject(Messages);
  private readonly store = inject(MembersSettingStore);
  private readonly tableHelper = inject(TableHelper);

  readonly filteredRoles = input<string[]>([]);
  readonly textFilter = input<string>('');
  readonly sort = signal<SortDescriptor[]>([
    { field: 'lastLogin', dir: 'desc' },
  ]);
  readonly filter = computed(() =>
    this.createFilter(this.textFilter(), this.filteredRoles())
  );
  readonly data = computed(() =>
    this.tableHelper.process(this.store.members() ?? [], {
      sort: this.sort(),
      filter: this.filter(),
    })
  );
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

  userActionClicked(member: UserViewModel, action: string): void {
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

  launchEdit(member: UserViewModel): void {
    EditMemberComponent.launchAsync(
      this.dialog,
      structuredClone(member)
    ).subscribe((results) => {
      if (results == undefined) return;

      const previous = member.roles.map((r) => r.id);
      const next = results.roles.map((r) => r.id);

      const toRemove = previous.filter((r) => !next.includes(r));
      const toAdd = next.filter((r) => !previous.includes(r));

      this.memberService.updateMemberRolesAsync(member, toAdd, toRemove);
    });
  }

  private openRemoveDialog(member: UserViewModel): void {
    this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
      .subscribe((answer) => {
        if (!answer) return;

        this.memberService.removeMemberAsync(member.userId);
      });
  }
}

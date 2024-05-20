import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
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
import { SortableDirective } from '@wbs/core/directives/table-sorter.directive';
import { Member } from '@wbs/core/models';
import { Messages, TableHelper } from '@wbs/core/services';
import { MemberViewModel } from '@wbs/core/view-models';
import { ActionIconListComponent } from '@wbs/components/_utils/action-icon-list.component';
import { SortArrowComponent } from '@wbs/components/_utils/sort-arrow.component';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MembershipAdminService } from '../../services';
import { EditMemberComponent } from '../edit-member';

@Component({
  standalone: true,
  selector: 'wbs-member-list',
  templateUrl: './member-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MembershipAdminService, TableHelper],
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
  private readonly memberService = inject(MembershipAdminService);
  private readonly messages = inject(Messages);
  private readonly tableHelper = inject(TableHelper);

  readonly members = model.required<MemberViewModel[] | undefined>();
  readonly org = input.required<string>();
  readonly filteredRoles = input<string[]>([]);
  readonly textFilter = input<string>('');
  readonly sort = signal<SortDescriptor[]>([
    { field: 'lastLogin', dir: 'desc' },
  ]);
  readonly filter = computed(() =>
    this.createFilter(this.textFilter(), this.filteredRoles())
  );
  readonly data = computed(() =>
    this.tableHelper.process(this.members() ?? [], {
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

  userActionClicked(member: MemberViewModel, action: string): void {
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

  launchEdit(member: MemberViewModel): void {
    EditMemberComponent.launchAsync(this.dialog, structuredClone(member))
      .pipe(
        switchMap((results) => {
          if (results == undefined) return of(undefined);

          const toRemove = member.roles.filter(
            (r) => !results.roles.includes(r)
          );
          const toAdd = results.roles.filter((r) => !member.roles.includes(r));

          member.roleList = member.roles.join(',');

          console.log('member', member);
          console.log('toRemove', toRemove);
          console.log('toAdd', toAdd);

          return this.memberService
            .updateMemberRolesAsync(this.org(), member, toAdd, toRemove)
            .pipe(map(() => results));
        })
      )
      .subscribe((result) => {
        if (!result) return;

        this.members.update((members) => {
          if (!members) return [];

          const index = members.findIndex((m) => m.id === result.id);
          members[index] = result;
          return [...members];
        });
      });
  }

  private openRemoveDialog(member: Member): void {
    this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(false);

          return this.memberService
            .removeMemberAsync(this.org(), member.id)
            .pipe(map(() => true));
        })
      )
      .subscribe((answer) => {
        if (!answer) return;

        this.members.update((members) => {
          if (!members) return [];

          const index = members.findIndex((m) => m.id === member.id);
          members.splice(index, 1);
          return [...members];
        });
      });
  }
}

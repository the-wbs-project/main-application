import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
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
    EditMemberComponent,
    RoleListPipe,
    SortableDirective,
    SortArrowComponent,
    TranslateModule,
  ],
})
export class MemberListComponent {
  private readonly memberService = inject(MembershipAdminService);
  private readonly messages = inject(Messages);
  private readonly tableHelper = inject(TableHelper);

  readonly members = model.required<MemberViewModel[]>();
  readonly org = input.required<string>();
  readonly filteredRoles = input<string[]>([]);
  readonly textFilter = input<string>('');
  readonly editMember = signal<MemberViewModel | undefined>(undefined);
  readonly state = signal(<State>{
    sort: [{ field: 'lastLogin', dir: 'desc' }],
  });
  readonly data = computed(() =>
    this.tableHelper.process(this.members(), this.state())
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

  constructor() {
    effect(() => this.updateState(this.textFilter(), this.filteredRoles()), {
      allowSignalWrites: true,
    });
  }

  userActionClicked(member: MemberViewModel, action: string): void {
    if (action === 'edit') {
      this.editMember.set(structuredClone(member));
    } else if (action === 'remove') {
      this.openRemoveDialog(member);
    }
  }

  private updateState(textFilter: string, filteredRoles: string[]): void {
    this.state.update((s) => {
      const state: State = { sort: s.sort };
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
      state.filter = {
        logic: 'and',
        filters,
      };
      return state;
    });
  }

  protected saveEditMember(): void {
    const member = this.editMember()!;

    const toRemove = member.roles.filter((r) => !member.roles.includes(r));
    const toAdd = member.roles.filter((r) => !member.roles.includes(r));

    member.roleList = member.roles.join(',');

    this.memberService
      .updateMemberRolesAsync(this.org(), member, toAdd, toRemove)
      .subscribe(() => {
        this.members.update((members) => {
          const index = members.findIndex((m) => m.id === member.id);
          members[index] = member;
          return members;
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
          const index = members.findIndex((m) => m.id === member.id);
          members.splice(index, 1);
          return members;
        });
      });
  }
}

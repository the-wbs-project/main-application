import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { groupBy } from '@progress/kendo-data-query';
import { NavigationService } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-workspaces',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule],
  template: `<kendo-dropdownlist
    [data]="list()"
    [value]="store.membership()"
    size="small"
    valueField="id"
    textField="name"
    class="tx-12"
    rounded="full"
    [showStickyHeader]="false"
    [itemDisabled]="itemDisabled"
    [popupSettings]="{ width: 'auto' }"
    (valueChange)="navigate($event.id)"
  />`,
})
export class WorkspacesComponent {
  private readonly navigation = inject(NavigationService);
  readonly store = inject(MembershipStore);

  readonly list = computed(() =>
    groupBy(
      [
        {
          id: '0',
          name: 'Personal (Coming soon...)',
          cat: 'Workspaces',
        },
        ...(this.store.memberships()?.map((x) => ({
          ...x,
          cat: 'Workspaces',
        })) ?? []),
      ],
      [{ field: 'cat' }]
    )
  );

  itemDisabled(itemArgs: { dataItem: string; index: number }) {
    return itemArgs.index === 0; // disable the 3rd item
  }

  navigate(org: string) {
    this.navigation.navigate([org, this.navigation.section()]);
  }
}

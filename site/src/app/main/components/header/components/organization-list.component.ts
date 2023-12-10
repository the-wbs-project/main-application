import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { Organization } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-header-organization-list',
  template: `@if (orgs.length === 1) { {{ org.display_name }} } @else {
    <kendo-dropdownlist
      [data]="orgs"
      [textField]="'display_name'"
      [valueField]="'name'"
      [value]="org"
      size="small"
      fillMode="outline"
      [ngClass]="'tx-white'"
      [popupSettings]="{ width: 'auto' }"
      (valueChange)="navigate($event.name)"
    />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule, NgClass],
})
export class OrganizationListComponent {
  @Input({ required: true }) org!: Organization;
  @Input({ required: true }) orgs!: Organization[];

  constructor(private readonly store: Store) {}

  navigate(org: string) {
    this.store.dispatch(new Navigate([org, 'projects']));
  }
}

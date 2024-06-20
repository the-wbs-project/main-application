import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { Membership } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-header-organization-list',
  template: `@if (orgs().length === 1) { {{ org().displayName }} } @else {
    <kendo-dropdownlist
      [data]="orgs()"
      textField="displayName"
      valueField="name"
      [value]="org()"
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
  private readonly store = inject(Store);

  readonly org = input.required<Membership>();
  readonly orgs = input.required<Membership[]>();

  navigate(org: string) {
    const originalOrg = this.org().name;
    const urlParts = window.location.toString().split('/');
    const orgIndex = urlParts.indexOf(originalOrg);
    const segment = urlParts[orgIndex + 1];

    this.store.dispatch(new Navigate([org, segment]));
  }
}

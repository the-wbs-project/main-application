import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { Organization } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-header-organization-list',
  template: `@if (orgs().length === 1) { {{ org().display_name }} } @else {
    <kendo-dropdownlist
      [data]="orgs()"
      textField="display_name"
      valueField="name"
      [value]="org()"
      size="small"
      fillMode="outline"
      class="tx-white"
      [popupSettings]="{ width: 'auto' }"
      (valueChange)="navigate($event.name)"
    />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule],
})
export class OrganizationListComponent {
  private readonly router = inject(Router);

  readonly org = input.required<Organization>();
  readonly orgs = input.required<Organization[]>();

  navigate(org: string) {
    const originalOrg = this.org().name;
    const urlParts = window.location.toString().split('/');
    const orgIndex = urlParts.indexOf(originalOrg);
    const segment = urlParts[orgIndex + 1];

    this.router.navigate([org, segment]);
  }
}

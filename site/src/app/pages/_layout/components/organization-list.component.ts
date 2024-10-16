import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { Membership } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-header-organization-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule],
  template: `@if (orgs().length === 1) { {{ org().name }} } @else {
    <kendo-dropdownlist
      [data]="orgs()"
      [value]="org()"
      size="small"
      valueField="id"
      textField="name"
      class="tx-white"
      fillMode="outline"
      [popupSettings]="{ width: 'auto' }"
      (valueChange)="navigate($event.id)"
    />
    }`,
})
export class OrganizationListComponent {
  private readonly router = inject(Router);

  readonly org = input.required<Membership>();
  readonly orgs = input.required<Membership[]>();

  navigate(org: string) {
    const originalOrg = this.org().id;
    const urlParts = window.location.toString().split('/');
    const orgIndex = urlParts.indexOf(originalOrg);
    const segment = urlParts[orgIndex + 1];

    this.router.navigate([org, segment]);
  }
}

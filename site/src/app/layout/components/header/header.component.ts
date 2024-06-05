import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { menuIcon } from '@progress/kendo-svg-icons';
import {
  APP_CONFIG_TOKEN,
  AppConfiguration,
  Organization,
  User,
} from '@wbs/core/models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { HEADER_ROUTE_ITEMS, HeaderRouteItem } from '../../models';
import { HeaderProfileComponent } from '../header-profile';
import { OrganizationListComponent } from '../organization-list.component';

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    HeaderProfileComponent,
    NgbDropdownModule,
    NgClass,
    OrganizationListComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class HeaderComponent {
  readonly appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);

  readonly user = input.required<User>();
  readonly roles = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly org = input.required<string>();
  readonly orgs = input.required<Organization[]>();
  readonly activeSection = input.required<string | undefined>();
  readonly menu = computed(() => this.createMenu(this.org()));
  readonly orgObj = computed(
    () => this.orgs().find((x) => x.name === this.org())!
  );
  readonly menuIcon = menuIcon;

  private createMenu(org: string | undefined): HeaderRouteItem[] {
    if (!org) return [];

    const menu2 = structuredClone(HEADER_ROUTE_ITEMS);

    for (const parent of menu2) {
      if (parent.type === 'sub') {
        for (const item of parent.items) {
          if (item.type === 'header') continue;

          item.route = item.route.map((x) => {
            if (x === ':orgId') return org;
            else return x;
          });
        }
      } else {
        parent.route = parent.route.map((x) => {
          if (x === ':orgId') return org;
          else return x;
        });
      }
    }
    return menu2;
  }
}

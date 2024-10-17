import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from '@progress/kendo-angular-menu';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { ActionButtonMenuItem, UserProfile } from '@wbs/core/models';
import { NavigationService } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';
import { environment } from 'src/env';
import { HEADER_ROUTE_ITEMS } from '../../models';
import { HeaderProfileComponent } from '../header-profile';
import { WorkspacesComponent } from '../workspaces.component';

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionButtonComponent,
    FontAwesomeModule,
    HeaderProfileComponent,
    MenuModule,
    TranslateModule,
    WorkspacesComponent,
  ],
})
export class HeaderComponent {
  private readonly store = inject(MembershipStore);

  readonly navigation = inject(NavigationService);

  readonly menuIcon = faBars;
  readonly title = environment.appTitle;
  readonly profile = input.required<UserProfile>();
  readonly roles = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly menu = computed(() => this.createMenu(this.store.membership()?.id));

  selected(route: string[] | undefined) {
    if (route) this.navigation.navigate(route);
  }

  private createMenu(org: string | undefined): ActionButtonMenuItem[] {
    if (!org) return [];

    const results: ActionButtonMenuItem[] = [];

    for (const parent of structuredClone(HEADER_ROUTE_ITEMS)) {
      const item = this.convert(parent, org);

      if (item) results.push(item);
    }
    return results;
  }

  private convert(
    item: ActionButtonMenuItem,
    org: string
  ): ActionButtonMenuItem | undefined {
    if (item.claim && !this.claims().includes(item.claim)) return undefined;

    if (item.route) {
      item.route = item.route.map((x) => (x === ':orgId' ? org : x));
    }

    if (!item.items) return item;

    const children: ActionButtonMenuItem[] = [];

    for (const child of item.items) {
      const converted = this.convert(child, org);
      if (converted) children.push(converted);
    }

    item.items = children;
    return item;
  }
}

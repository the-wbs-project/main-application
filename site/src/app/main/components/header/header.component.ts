import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { menuIcon } from '@progress/kendo-svg-icons';
import { Organization } from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { environment } from 'src/environments/environment';
import { HeaderProfileComponent } from './components/header-profile/header-profile.component';
import { OrganizationListComponent } from './components/organization-list.component';
import { HEADER_ROUTE_ITEMS, HeaderRouteItem } from './models';

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
export class HeaderComponent implements OnChanges {
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) org!: Organization;
  @Input({ required: true }) orgs!: Organization[];

  readonly menuIcon = menuIcon;
  readonly appTitle = environment.appTitle;
  readonly menu = signal<HeaderRouteItem[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['org'] && this.org) {
      const menu2 = structuredClone(HEADER_ROUTE_ITEMS);

      for (const parent of menu2) {
        for (const item of parent.items) {
          if (item.type === 'header') continue;

          item.route = item.route.map((x) => {
            if (x === ':orgId') return this.org.name;
            else return x;
          });
        }
      }
      this.menu.set(menu2);
    }
  }
}

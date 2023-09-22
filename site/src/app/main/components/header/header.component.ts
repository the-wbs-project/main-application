import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { menuIcon } from '@progress/kendo-svg-icons';
import { ToggleSidebar } from '@wbs/main/actions';
import { OrgUrlPipe } from '@wbs/main/pipes/org-url.pipe';
import { MembershipState, RolesState } from '@wbs/main/states';
import { environment } from 'src/environments/environment';
import { HeaderProfileComponent } from './header-profile/header-profile.component';
import { ROLES } from '@wbs/core/models';
import { RoleFilterPipe } from '@wbs/main/pipes/role-filter.pipe';

interface RouteLinkGroup {
  label: string;
  roles?: string[];
  items: (
    | { type: 'header'; label: string }
    | {
        type: 'link';
        route: string[];
        label: string;
      }
  )[];
}

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    HeaderProfileComponent,
    NgbDropdownModule,
    NgFor,
    NgForOf,
    NgIf,
    OrgUrlPipe,
    RoleFilterPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class HeaderComponent {
  readonly org = toSignal(this.store.select(MembershipState.organization));
  readonly userRoles = toSignal(this.store.select(RolesState.orgRoles));
  readonly menuIcon = menuIcon;
  readonly appTitle = environment.appTitle;
  readonly menu: RouteLinkGroup[] = [
    {
      label: 'General.Projects',
      items: [
        {
          type: 'link',
          route: ['/', ':orgId', 'projects'],
          label: 'General.ProjectList',
        },
        {
          type: 'link',
          route: ['/', ':orgId', 'projects', 'create'],
          label: 'General.CreateProject',
        },
      ],
    },
    {
      label: 'General.Settings',
      roles: [ROLES.ADMIN],
      items: [
        {
          type: 'header',
          label: 'General.Organizational',
        },
        {
          type: 'link',
          route: ['/', ':orgId', 'settings', 'members'],
          label: 'General.Members',
        },
      ],
    },
  ];

  constructor(private readonly store: Store) {}

  toggleSidebar() {
    this.store.dispatch(new ToggleSidebar());
  }
}

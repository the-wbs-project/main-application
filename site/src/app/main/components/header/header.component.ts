import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { menuIcon } from '@progress/kendo-svg-icons';
import { ToggleSidebar } from '@wbs/main/actions';
import { OrgUrlPipe } from '@wbs/main/pipes/org-url.pipe';
import { MembershipState } from '@wbs/main/states';
import { environment } from 'src/environments/environment';
import { HeaderProfileComponent } from './header-profile/header-profile.component';

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    NgbDropdownModule,
    HeaderProfileComponent,
    NgbNavModule,
    NgFor,
    NgForOf,
    NgIf,
    OrgUrlPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class HeaderComponent {
  readonly org = toSignal(this.store.select(MembershipState.organization));
  readonly menuIcon = menuIcon;
  readonly appTitle = environment.appTitle;
  readonly menu = [
    {
      header: 'General.Projects',
      items: [
        {
          url: ['/', ':orgId', 'projects'],
          text: 'General.ProjectList',
        },
        {
          header: 'General.Actions',
        },
        {
          url: ['/', ':orgId', 'projects', 'create'],
          text: 'General.CreateProject',
        },
      ],
    },
    {
      header: 'General.Settings',
      items: [
        {
          header: 'General.Organizational',
        },
        {
          url: ['/', ':orgId', 'settings', 'members'],
          text: 'General.Members',
        },
      ],
    },
  ];

  constructor(private readonly store: Store) {}

  toggleSidebar() {
    this.store.dispatch(new ToggleSidebar());
  }
}

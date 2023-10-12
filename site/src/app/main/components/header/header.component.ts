import { NgFor, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { menuIcon } from '@progress/kendo-svg-icons';
import {
  ORGANIZATION_CLAIMS,
  Organization,
  PROJECT_CLAIMS,
} from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { OrgUrlPipe } from '@wbs/main/pipes/org-url.pipe';
import { environment } from 'src/environments/environment';
import { HeaderProfileComponent } from './header-profile/header-profile.component';

interface RouteLinkGroup {
  label: string;
  claim?: string;
  items: (
    | { type: 'header'; label: string }
    | {
        type: 'link';
        route: string[];
        label: string;
        claim?: string;
      }
  )[];
}

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    HeaderProfileComponent,
    NgbDropdownModule,
    NgFor,
    NgForOf,
    NgIf,
    OrgUrlPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class HeaderComponent {
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) org!: Organization;

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
          claim: PROJECT_CLAIMS.CREATE,
        },
      ],
    },
    {
      label: 'General.Settings',
      claim: ORGANIZATION_CLAIMS.SETTINGS.READ,
      items: [
        {
          type: 'header',
          label: 'General.Organizational',
        },
        {
          type: 'link',
          route: ['/', ':orgId', 'settings', 'members'],
          label: 'General.Members',
          claim: ORGANIZATION_CLAIMS.MEMBERS.READ,
        },
      ],
    },
  ];
}

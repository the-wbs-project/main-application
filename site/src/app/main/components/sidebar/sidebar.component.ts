import { NgFor, NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { plusIcon } from '@progress/kendo-svg-icons';
import { Organization, Project } from '@wbs/core/models';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { environment } from 'src/environments/environment';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';
import { ProjectStatusCountPipe } from '../../pipes/project-status-count.pipe';

@Component({
  standalone: true,
  selector: 'wbs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    FillElementDirective,
    NgFor,
    NgIf,
    ProjectStatusCountPipe,
    RouterModule,
    SVGIconModule,
    TranslateModule,
  ],
})
export class SidebarComponent {
  @Input() organization?: Organization | null;
  @Input() organizations?: Organization[] | null;
  @Input() projects?: Project[] | null;
  @Input() isAdmin?: boolean | null;

  readonly plusIcon = plusIcon;
  readonly urlPrefix = environment.apiPrefix;
  readonly settings = ORG_SETTINGS_MENU_ITEMS;
}

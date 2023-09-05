import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Organization, Project } from '@wbs/core/models';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';
import { ProjectStatusCountPipe } from '../../pipes/project-status-count.pipe';
import { NavService } from '../../services';
import { switcherArrowFn } from './sidebar';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { plusIcon } from '@progress/kendo-svg-icons';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';

@Component({
  standalone: true,
  selector: 'wbs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FillElementDirective,
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
  scrolled = false;

  constructor(private readonly navServices: NavService) {}

  ngOnInit(): void {
    let sidemenu = document.querySelector('.side-menu');
    sidemenu?.addEventListener('scroll', () => {}, { passive: false });
    sidemenu?.addEventListener('wheel', () => {}, { passive: false });

    switcherArrowFn();

    fromEvent(window, 'resize').subscribe(() => {
      if (window.innerWidth > 772) {
        document
          .querySelector('body.horizontal')
          ?.classList.remove('sidenav-toggled');
      }
      if (
        document
          .querySelector('body')
          ?.classList.contains('horizontal-hover') &&
        window.innerWidth > 772
      ) {
        let li = document.querySelectorAll('.side-menu li');
        li.forEach((e, i) => {
          e.classList.remove('is-expanded');
        });
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 70;
  }

  sidebarClose() {
    if (this.navServices.collapseSidebar === true) {
      document.querySelector('.app')?.classList.remove('sidenav-toggled');
      this.navServices.collapseSidebar = false;
    }
  }
}

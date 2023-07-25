import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '@wbs/core/models';
import { fromEvent } from 'rxjs';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';
import { NavService } from '../../services';
import { switcherArrowFn } from './sidebar';
import { ProjectStatusCountPipe } from '../../pipes/project-status-count.pipe';

@Component({
  standalone: true,
  selector: 'wbs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ProjectStatusCountPipe, RouterModule, TranslateModule]
})
export class SidebarComponent {
  @Input() projects?: Project[] | null;
  @Input() isAdmin?: boolean | null;

  readonly auth = inject(AuthService);
  readonly navServices = inject(NavService);
  readonly settings = ORG_SETTINGS_MENU_ITEMS;
  scrolled = false;

  ngOnInit(): void {
    let sidemenu = document.querySelector('.side-menu');
    sidemenu?.addEventListener('scroll', () => { }, { passive: false });
    sidemenu?.addEventListener('wheel', () => { }, { passive: false });

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
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector('.app')?.classList.remove('sidenav-toggled');
      this.navServices.collapseSidebar = false;
    }
  }
}

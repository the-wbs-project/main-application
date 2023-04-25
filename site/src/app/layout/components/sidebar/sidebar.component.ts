import {
  Component,
  HostListener,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MenuItem, Project } from '@wbs/core/models';
import { fromEvent } from 'rxjs';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';
import { NavService } from '../../services';
import { switcherArrowFn } from './sidebar';
import { AuthService } from '@auth0/auth0-angular';

@UntilDestroy()
@Component({
  selector: 'wbs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() projects?: Project[] | null;
  @Input() isAdmin?: boolean | null;

  readonly settings = ORG_SETTINGS_MENU_ITEMS;
  menuItems!: MenuItem[];
  url: any;

  constructor(
    readonly auth: AuthService,
    private readonly navServices: NavService
  ) {}

  setNavActive(item: any) {
    this.menuItems.filter((menuItem) => {
      if (menuItem !== item) {
        menuItem.active = false;
        document.querySelector('.app')?.classList.remove('sidenav-toggled');
        document.querySelector('.app')?.classList.remove('sidenav-toggled1');
        this.navServices.collapseSidebar = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter((submenuItems) => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggleNavActive(item: any) {
    if (!item.active) {
      this.menuItems.forEach((a: any) => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b: any) => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
        return;
      });
    }
    item.active = !item.active;
  }

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

  sidebarClose() {
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector('.app')?.classList.remove('sidenav-toggled');
      this.navServices.collapseSidebar = false;
    }
  }

  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 70;
  }
}

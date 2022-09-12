import {
  Component,
  ViewEncapsulation,
  HostListener,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowAltCircleLeft,
  faBoxArchive,
  faCogs,
  faGenderless,
  faSpaceStationMoonConstruction,
} from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { MenuItem, Project } from '@wbs/shared/models';
import { NavService } from '@wbs/shared/services';
import { fromEvent } from 'rxjs';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';
import { switcherArrowFn } from './sidebar';

@UntilDestroy()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() projects?: Project[] | null;
  @Input() isAdmin?: boolean | null;

  readonly settings = ORG_SETTINGS_MENU_ITEMS;
  readonly faArrowAltCircleLeft = faArrowAltCircleLeft;
  readonly faBoxArchive = faBoxArchive;
  readonly faCogs = faCogs;
  readonly faGenderless = faGenderless;
  readonly faSpaceStation = faSpaceStationMoonConstruction;
  menuItems!: MenuItem[];
  url: any;

  constructor(
    private readonly router: Router,
    private readonly navServices: NavService,
    private readonly store: Store
  ) {}

  //Active NavBar State
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
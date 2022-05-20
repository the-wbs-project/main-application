import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAlignLeft, faX } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  LayoutService,
  NavService,
  SwitcherService,
} from '@wbs/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private body: HTMLBodyElement | any = document.querySelector('body');

  readonly faAlignLeft = faAlignLeft;
  readonly faX = faX;
  readonly settings = [
    {
      text: 'General.CreateProject',
      url: ['/projects', 'create'],
    },
  ];
  isCollapsed = true;
  activated: boolean = false;

  constructor(
    readonly SwitcherService: SwitcherService,
    readonly navServices: NavService,
    private readonly layoutService: LayoutService,
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {}

  ngOnInit(): void {}
  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    //this.auth.SignOut();
    //this.router.navigate(['/auth/login']);
  }

  open(content: any) {
    this.modalService.open(content, {
      backdrop: 'static',
      windowClass: 'modalCusSty',
    });
  }

  searchToggle() {
    if (this.body.classList.contains('search-open')) {
      this.activated = false;
      this.body.classList.remove('search-open');
    } else {
      this.activated = true;
      this.body.classList.add('search-open');
    }
  }
  closeToggle() {
    this.activated = false;
    this.body.classList.remove('search-open');
  }

  navigate(url: string[]): void {
    this.store.dispatch(new Navigate(url));
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService, NavService, SwitcherService } from '@wbs/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private body: HTMLBodyElement | any = document.querySelector('body');
  public isCollapsed = true;
  activated: boolean = false;

  constructor(
    private layoutService: LayoutService,
    public SwitcherService: SwitcherService,
    public navServices: NavService,
    private router: Router,
    private modalService: NgbModal
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
}

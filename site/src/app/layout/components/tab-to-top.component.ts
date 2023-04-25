import { ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { faAngleUp } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'wbs-tab-to-top',
  template: `<a
    href="javascript:void(0)"
    id="back-to-top"
    class="pd-t-5"
    (click)="taptotop()"
    [ngStyle]="{
      display: show ? 'block' : 'none'
    }"
  >
    <fa-icon [icon]="faAngleUp" size="3x"></fa-icon>
  </a> `,
})
export class TabToTopComponent {
  readonly faAngleUp = faAngleUp;

  show = false;

  constructor(private viewScroller: ViewportScroller) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number > 400) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  taptotop() {
    this.viewScroller.scrollToPosition([0, 0]);
  }
}

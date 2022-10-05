import { ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-tab-to-top',
  template: `<a
    href="javascript:void(0)"
    id="back-to-top"
    (click)="taptotop()"
    [ngStyle]="{
      display: show ? 'block' : 'none'
    }"
  >
    <i class="fa-solid fa-angle-up fa-3x pd-t-5"></i>
  </a> `,
})
export class TabToTopComponent {
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

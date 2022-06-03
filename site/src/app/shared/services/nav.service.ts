import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  readonly screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Collapse Sidebar
  collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);

    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event: any) => {
        this.collapseSidebar = true;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }
}

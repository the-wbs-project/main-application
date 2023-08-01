import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { MainContentSizeChanged } from '@wbs/core/actions';
import { Subscription, timer } from 'rxjs';

@Directive({ selector: '[appMainContent]', standalone: true })
export class MainContentDirective implements OnDestroy {
  private readonly sub: Subscription;
  private lastSize = 0;
  private elem: HTMLElement;

  constructor(ref: ElementRef, private readonly store: Store) {
    this.elem = ref.nativeElement;

    this.sub = timer(0, 500).subscribe(() => {
      const width = this.elem.offsetWidth;

      if (this.lastSize === width) return;

      this.lastSize = width;
      this.store.dispatch(new MainContentSizeChanged(width));
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

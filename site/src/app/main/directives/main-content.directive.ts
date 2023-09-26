import { Directive, ElementRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { MainContentSizeChanged } from '@wbs/main/actions';
import { timer } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[appMainContent]', standalone: true })
export class MainContentDirective {
  private lastSize = 0;
  private elem: HTMLElement;

  constructor(ref: ElementRef, private readonly store: Store) {
    this.elem = ref.nativeElement;

    timer(0, 500)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const width = this.elem.offsetWidth;

        if (this.lastSize === width) return;

        this.lastSize = width;
        this.store.dispatch(new MainContentSizeChanged(width));
      });
  }
}

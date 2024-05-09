import { Directive, ElementRef, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UiStore } from '@wbs/store';
import { timer } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[appMainContent]', standalone: true })
export class MainContentDirective {
  private readonly uiStore = inject(UiStore);
  private lastSize = 0;
  private elem: HTMLElement;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;

    timer(0, 500)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const width = this.elem.offsetWidth;

        if (this.lastSize === width) return;

        this.lastSize = width;
        this.uiStore.setMainContentWidth(width);
      });
  }
}

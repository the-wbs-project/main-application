import { Directive, ElementRef, effect, input } from '@angular/core';

@Directive({ selector: '[appScrollToTop]', standalone: true })
export class ScrollToTopDirective {
  readonly appScrollToTop = input.required<any>();

  constructor(ref: ElementRef<HTMLElement>) {
    effect(() => {
      const x = this.appScrollToTop();

      ref.nativeElement.scrollTo(0, 0);
    });
  }
}

import { Directive, ElementRef, inject } from '@angular/core';
import { UiStore } from '@wbs/core/store';

@Directive({ selector: '[appMainContent]', standalone: true })
export class MainContentDirective {
  private readonly uiStore = inject(UiStore);
  private lastSize = 0;
  private elem: HTMLElement;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;

    setTimeout(() => {
      const width = this.elem.offsetWidth;

      if (this.lastSize === width) return;

      this.lastSize = width;
      this.uiStore.setMainContentWidth(width);
    }, 500);
  }
}

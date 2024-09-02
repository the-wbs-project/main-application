import { Directive, ElementRef, model } from '@angular/core';

@Directive({ selector: '[wbsHeight]', standalone: true })
export class HeightDirective {
  readonly wbsHeight = model.required<number | undefined>();
  private lastSize = 0;

  constructor(ref: ElementRef) {
    setTimeout(() => {
      const height = ref.nativeElement.offsetHeight;

      if (this.lastSize === height) return;

      this.lastSize = height;
      this.wbsHeight.set(height);
    }, 500);
  }
}

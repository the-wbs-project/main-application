import { Directive, ElementRef, model } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[wbsHeight]', standalone: true })
export class HeightDirective {
  readonly wbsHeight = model.required<number | undefined>();
  private lastSize = 0;

  constructor(ref: ElementRef) {
    timer(0, 500)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const height = ref.nativeElement.offsetHeight;

        if (this.lastSize === height) return;

        this.lastSize = height;
        this.wbsHeight.set(height);
      });
  }
}

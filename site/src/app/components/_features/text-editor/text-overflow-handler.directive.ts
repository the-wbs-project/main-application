import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';

@UntilDestroy()
@Directive({
  selector: '[wbsTextOverflowHandler]',
})
export class TextOverflowHandlerDirective implements OnInit {
  private pastHtml = '';
  private pastSize = 0;

  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    const div: HTMLDivElement = this.el.nativeElement;

    interval(200)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (
          this.pastHtml === div.innerHTML &&
          this.pastSize === div.offsetWidth
        )
          return;

        let size = 24;

        div.style.fontSize = `${size}px`;

        while (div.offsetWidth < div.scrollWidth && size > 0) {
          size--;
          div.style.fontSize = `${size}px`;
        }
        this.pastHtml = div.innerHTML;
        this.pastSize = div.offsetWidth;
      });
  }
}

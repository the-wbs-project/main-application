import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[appMatchSize]', standalone: true })
export class MatchSizeDirective implements OnInit {
  private lastSize = 0;
  @Input() idToMatch: string | undefined;
  @Input() paddingBottom = 0;
  private elem: HTMLElement;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;
  }

  ngOnInit(): void {
    timer(0, 20)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.setSize());
  }

  private setSize() {
    if (!this.idToMatch) return;

    const item = document.getElementById(this.idToMatch);
    const height = item?.offsetHeight ?? 5;

    if (height === this.lastSize) return;

    this.lastSize = height;

    this.elem.style.height = `${height - this.paddingBottom}px`;
  }
}

import { Directive, ElementRef, OnInit, input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[appMatchSize]', standalone: true })
export class MatchSizeDirective implements OnInit {
  readonly idToMatch = input<string | undefined>();
  readonly paddingBottom = input<number>(0);

  private elem: HTMLElement;
  private lastSize = 0;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;
  }

  ngOnInit(): void {
    timer(0, 20)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.setSize());
  }

  private setSize() {
    const idToMatch = this.idToMatch();

    if (!idToMatch) return;

    const item = document.getElementById(idToMatch);
    const height = item?.offsetHeight ?? 5;

    if (height === this.lastSize) return;

    this.lastSize = height;

    this.elem.style.height = `${height - this.paddingBottom()}px`;
  }
}

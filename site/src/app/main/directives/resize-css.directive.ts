import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ResizedEvent } from '../models';

@Directive({
  selector: '[resizedCss]',
  standalone: true,
  host: {
    '[class.wbs-container-sm]': 'size <= 576',
    '[class.wbs-container-md]': 'size > 576 && size <= 768',
    '[class.wbs-container-lg]': 'size > 768 && size <= 992',
    '[class.wbs-container-xl]': 'size > 992 && size <= 1200',
    '[class.wbs-container-xxl]': 'size > 1200',
  },
})
export class ResizedCssDirective implements OnInit, OnDestroy {
  private observer: ResizeObserver;

  size = 0;

  public constructor(
    private readonly element: ElementRef,
    private readonly zone: NgZone
  ) {
    this.observer = new ResizeObserver(() =>
      this.zone.run(() => this.observe())
    );
  }

  ngOnInit(): void {
    this.observer.observe(this.element.nativeElement);
    this.observe();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private observe(): void {
    this.size = (<HTMLElement>this.element.nativeElement).offsetWidth;
  }
}

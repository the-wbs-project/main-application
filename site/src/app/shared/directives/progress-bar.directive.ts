import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';

@Directive({ selector: '[appProgress]' })
export class ProgressBarDirective implements AfterViewInit, OnChanges {
  @Input() min: number | null | undefined;
  @Input() max: number | null | undefined;
  @Input() value: number | null | undefined;

  private readonly elem: HTMLDivElement;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;
  }

  ngAfterViewInit(): void {
    this.elem.className =
      'progress-bar progress-bar-striped progress-bar-animated bg-primary ht-20 txt-black';

    this.elem.setAttribute('role', 'progressbar');
  }

  ngOnChanges(): void {
    const min = this.min ?? 0;
    const max = this.max ?? 0;
    const value = this.value ?? 0;
    const range = max - min;

    const widthFull = range == 0 ? 0 : value / range;
    const width = Math.round(widthFull * 100);

    this.elem.style.width = `${width}%`;
    this.elem.setAttribute('attr.aria-valuenow', value.toString());
    this.elem.setAttribute('aria-valuemin', min.toString());
    this.elem.setAttribute('aria-valuemax', max.toString());
  }
}

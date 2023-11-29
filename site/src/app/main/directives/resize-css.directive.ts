import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

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
export class ResizedCssDirective implements OnInit {
  protected size = 0;

  public constructor(private readonly element: ElementRef) {}

  ngOnInit(): void {
    this.observe();
  }

  @HostListener('window:resize')
  windowResized() {
    this.observe();
  }

  private observe(): void {
    this.size = (<HTMLElement>this.element.nativeElement).offsetWidth;
  }
}

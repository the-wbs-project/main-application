import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({ selector: '[appFillElement]' })
export class FillElementDirective implements AfterViewChecked {
  private delayNumber = 0;
  @Input() paddingBottom = 0;
  @Input() changeDelay = 0;
  private elem: HTMLElement;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;
  }

  ngAfterViewChecked() {
    this.setSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.setSize();
  }

  private setSize() {
    const newId = this.delayNumber + 1;
    this.delayNumber++;
    setTimeout(() => {
      if (this.delayNumber !== newId) return;
      const pos = this.cumulativeOffset();

      this.elem.style.height = `${
        window.innerHeight - pos.top - this.paddingBottom
      }px`;
    }, this.changeDelay);
  }

  private cumulativeOffset(): Position {
    let element = this.elem;
    let top = 0,
      left = 0;
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = <HTMLElement>element.offsetParent;
    } while (element != null);

    return {
      top: top,
      left: left,
    };
  }
}

interface Position {
  top: number;
  left: number;
}

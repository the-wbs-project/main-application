import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { UiStore } from '@wbs/store';

@Directive({ selector: '[appFillElement]', standalone: true })
export class FillElementDirective implements AfterViewChecked {
  private readonly uiStore = inject(UiStore);

  readonly paddingBottom = input<number>(0);
  readonly changeDelay = input<number>(0);

  private readonly footerHeight = 40;
  private readonly elem: HTMLElement;
  private delayNumber = 0;

  constructor(ref: ElementRef) {
    this.elem = ref.nativeElement;
  }

  private get disabled(): boolean {
    return this.uiStore.isMobile;
  }

  ngAfterViewChecked() {
    if (this.disabled) return;
    this.setSize();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.disabled) return;
    this.setSize();
  }

  private setSize() {
    const newId = this.delayNumber + 1;
    this.delayNumber++;
    setTimeout(() => {
      if (this.delayNumber !== newId) return;
      const pos = this.cumulativeOffset();

      this.elem.style.height = `${
        window.innerHeight - pos.top - this.paddingBottom() - this.footerHeight
      }px`;
    }, this.changeDelay());
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

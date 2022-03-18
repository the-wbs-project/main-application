import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({ selector: '[appMatchRowHeight]' })
export class MatchRowHeightDirective implements AfterViewChecked {
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
    let max = 0;

    for (let i = 0; i < this.elem.children.length; i++) {
      const cell = <HTMLTableCellElement | null | undefined>(
        this.elem.children.item(i)?.children.item(1)
      );

      if (!cell) continue;

      const height = cell.offsetHeight;

      if (height > max) max = height;
    }
    const maxPx = `${max}px`;

    for (let i = 0; i < this.elem.children.length; i++) {
      const row = <HTMLTableRowElement | null | undefined>(
        this.elem.children.item(i)
      );

      if (!row) continue;

      row.style.height = maxPx;
    }
  }
}

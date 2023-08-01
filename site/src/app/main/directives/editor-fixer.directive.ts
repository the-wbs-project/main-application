import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Directive({ selector: '[appEditorFixer]', standalone: true })
export class EditorFixerDirective implements OnInit {
  private lastSize = 0;

  constructor(private readonly ref: ElementRef) {}

  ngOnInit(): void {
    timer(0, 250)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.setSize());
  }

  @HostListener('window:resize')
  onResize() {
    this.setSize();
  }

  private setSize() {
    const elem: HTMLElement = this.ref.nativeElement;
    const parent = elem.parentElement;
    const width = parent?.offsetWidth ?? 0;

    if (this.lastSize === width) return;

    elem.style.width = `${width - 2}px`;

    this.lastSize = width;
  }
}

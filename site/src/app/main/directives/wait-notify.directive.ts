import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IdService, Messages } from '@wbs/core/services';

@Directive({
  selector: '[waitNotify]',
  standalone: true,
})
export class WaitNotifyDirective implements OnInit, OnChanges {
  @Input() show?: boolean;
  @Input() message?: string;

  private readonly elem: HTMLElement;
  private readonly className: string;

  constructor(ref: ElementRef, private readonly messages: Messages) {
    this.className = IdService.generate();

    this.elem = ref.nativeElement;
    this.elem.classList.add(this.className);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      if (this.show)
        this.messages.block.show('.' + this.className, this.message);
      else this.messages.block.cancel('.' + this.className);
    }
  }

  ngOnInit(): void {}
}

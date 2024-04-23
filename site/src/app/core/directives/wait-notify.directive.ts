import { Directive, ElementRef, effect, input } from '@angular/core';
import { IdService, Messages } from '@wbs/core/services';

@Directive({
  selector: '[waitNotify]',
  standalone: true,
})
export class WaitNotifyDirective {
  private readonly elem: HTMLElement;
  private readonly className: string;

  readonly show = input<boolean | undefined>();
  readonly message = input<string | undefined>();

  constructor(ref: ElementRef, private readonly messages: Messages) {
    this.className = IdService.generate();

    this.elem = ref.nativeElement;
    this.elem.classList.add(this.className);

    effect(() => {
      try {
        const show = this.show();

        if (show && this.elem)
          this.messages.block.show('.' + this.className, this.message());
        else this.messages.block.cancel('.' + this.className);
      } catch (e: any) {
        console.log('Message: ' + e.message);
      }
    });
  }
}

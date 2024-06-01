import { Directive, ElementRef, OnInit, input, output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, timer } from 'rxjs';
import { debounce, map } from 'rxjs/operators';
import { IdService } from '../services';

@UntilDestroy()
@Directive({ standalone: true, selector: '[appDelayedInput]' })
export class DelayedInputDirective implements OnInit {
  private passcode = '';

  readonly delayTime = input(500);
  readonly delayedInput = output<string>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    fromEvent<InputEvent>(this.elementRef.nativeElement, 'input')
      .pipe(
        map(() => {
          this.passcode = IdService.generate();

          return this.passcode;
        }),
        debounce(() => timer(this.delayTime())),
        untilDestroyed(this)
      )
      .subscribe((passcode) => {
        if (this.passcode === passcode)
          this.delayedInput.emit(this.elementRef.nativeElement.value);
      });
  }
}

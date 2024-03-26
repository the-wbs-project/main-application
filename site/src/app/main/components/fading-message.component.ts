import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-fading-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
  template: `<div
    class="d-ib"
    [ngClass]="cssClass() ?? ''"
    [@fade]="show() ? 'in' : 'out'"
  >
    @if (icon(); as icon) {
    <fa-icon [icon]="icon" />&nbsp; }
    {{ message() | translate }}
  </div>`,
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in <=> out', animate('1s ease-in-out')),
    ]),
  ],
})
export class FadingMessageComponent {
  readonly icon = input<IconDefinition>();
  readonly show = input.required<boolean>();
  readonly message = input.required<string>();
  readonly cssClass = input<string | string[]>();
}

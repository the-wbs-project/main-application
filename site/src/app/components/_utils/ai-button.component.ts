import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ButtonSize,
  ButtonThemeColor,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-ai-button',
  template: `<button
    kendoButton
    [size]="size()"
    [themeColor]="themeColor()"
    [ngClass]="buttonClass()"
  >
    <fa-icon [icon]="icon" class="mg-r-5" />
    {{ 'General.AskAi' | translate }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, NgClass, TranslateModule],
})
export class AiButtonComponent {
  readonly themeColor = input<ButtonThemeColor>('base');
  readonly size = input<ButtonSize>('medium');
  readonly buttonClass = input<string | string[]>();
  readonly icon = faComment;
}

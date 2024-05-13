import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-ai-button',
  template: `<button
    class="btn"
    [ngClass]="buttonCssClass()"
    (click)="click.emit()"
  >
    <fa-icon [icon]="icon" class="mg-r-5" />
    {{ 'General.AskAi' | translate }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class AiButtonComponent {
  readonly buttonCssClass = input.required<string | string[]>();
  readonly click = output<void>();
  readonly icon = faComment;
}

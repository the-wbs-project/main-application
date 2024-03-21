import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-info-message',
  template: `<label class="tx-12 tx-italic" [ngClass]="cssClass()">
    <fa-icon [icon]="icon" size="lg" />
    {{ message() | translate }}
  </label>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class InfoMessageComponent {
  readonly message = input.required<string>();
  readonly cssClass = input<string>();
  readonly icon = faCircleInfo;
}

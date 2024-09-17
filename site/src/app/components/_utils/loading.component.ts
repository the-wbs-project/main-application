import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'wbs-loading',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
  template: `<div class="w-100 mg-t-50">
    <fa-duotone-icon [icon]="faSpinner" size="5x" animation="spin" />
    <h3 class="pd-t-20">
      {{ message() ?? ('General.Loading' | translate) }}
    </h3>
  </div>`,
})
export class LoadingComponent {
  readonly faSpinner = faSpinner;
  readonly message = input<string | undefined>();
}

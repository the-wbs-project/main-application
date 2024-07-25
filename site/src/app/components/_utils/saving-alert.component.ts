import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-saving-alert',
  template: `<ngb-alert type="info" [animation]="true" [dismissible]="false">
    <div class="d-flex flex-align-center w-100">
      <div class="wd-40">
        <fa-duotone-icon [icon]="faSpinner" size="xl" animation="spin" />
      </div>
      <div class="flex-fill">
        {{ 'General.Saving' | translate }}
      </div>
    </div>
  </ngb-alert>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbAlertModule, FontAwesomeModule, TranslateModule],
})
export class SavingAlertComponent {
  readonly faSpinner = faSpinner;
}

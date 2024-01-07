import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-wizard-footer',
  templateUrl: './wizard-footer.component.html',
  imports: [TranslateModule],
})
export class WizardFooterComponent {
  @Input() view?: string;
  @Input() showBack = true;
  @Input() showContinue = true;
  @Input() disableBack = false;
  @Input() disableContinue = false;
  @Output() readonly backClicked = new EventEmitter<void>();
  @Output() readonly continueClicked = new EventEmitter<void>();
}

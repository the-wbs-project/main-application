import { Component, EventEmitter, Output, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-wizard-footer',
  templateUrl: './wizard-footer.component.html',
  imports: [TranslateModule],
})
export class WizardFooterComponent {
  @Output() readonly backClicked = new EventEmitter<void>();
  @Output() readonly continueClicked = new EventEmitter<void>();

  readonly view = input<string>();
  readonly showBack = input<boolean>(true);
  readonly disableBack = input<boolean>(true);
  readonly showContinue = input<boolean>(false);
  readonly disableContinue = input<boolean>(false);

  readonly backText = input<string>('General.Back');
  readonly continueText = input<string>('General.Continue');
}

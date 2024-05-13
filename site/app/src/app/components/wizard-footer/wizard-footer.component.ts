import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-wizard-footer',
  templateUrl: './wizard-footer.component.html',
  imports: [TranslateModule],
})
export class WizardFooterComponent {
  readonly backClicked = output<void>();
  readonly continueClicked = output<void>();

  readonly view = input<string>();
  readonly showBack = input<boolean>(true);
  readonly disableBack = input<boolean>(false);
  readonly showContinue = input<boolean>(true);
  readonly disableContinue = input<boolean>(false);

  readonly backText = input<string>('General.Back');
  readonly continueText = input<string>('General.Continue');
}

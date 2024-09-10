import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SaveButtonComponent } from '../_utils/save-button.component';

@Component({
  standalone: true,
  selector: 'wbs-dialog-buttons',
  templateUrl: './dialog-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, SaveButtonComponent, TranslateModule],
})
export class DialogButtonsComponent {
  //
  //  Inputs
  //
  readonly view = input.required<number>();
  readonly canContinue = input.required<boolean>();
  readonly nextButtonLabel = input('General.Next');
  readonly showSave = input.required<boolean>();
  readonly isSaving = input.required<boolean>();
  readonly saveLabel = input('General.Save');
  readonly savingLabel = input('General.Saving');
  //
  //  Output
  //
  readonly next = output<void>();
  readonly back = output<void>();
  readonly save = output<void>();
}

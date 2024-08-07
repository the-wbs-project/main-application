import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { VisibilityTextComponent } from '../visibility-text.component';

@Component({
  standalone: true,
  selector: 'wbs-visibility-selection',
  templateUrl: './visibility-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TranslateModule, VisibilityTextComponent],
})
export class VisibilitySelectionComponent {
  readonly visibility = model<string | undefined>();
}

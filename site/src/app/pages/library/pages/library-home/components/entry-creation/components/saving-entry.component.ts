import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SaveState } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-saving-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
  template: `@if (saveState() === "saving") {
    <fa-duotone-icon [icon]="faSpinner" size="5x" animation="spin" />
    <p class="tx-18 mg-t-10">{{ 'General.Saving' | translate }}</p>
    } @else if (saveState() === "error") {
    <fa-icon [icon]="faExclamationTriangle" size="5x" />
    <p class="tx-18 mg-t-10">{{ 'LibraryCreate.ErrorSaving' | translate }}</p>
    }`,
})
export class SavingEntryComponent {
  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly saveState = input.required<SaveState>();
}

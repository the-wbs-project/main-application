import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ButtonSize,
  ButtonThemeColor,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-save-button',
  template: `<button
    kendoButton
    [size]="size()"
    [themeColor]="themeColor()"
    [ngClass]="buttonClass()"
    [disabled]="disabled() || isSaving()"
  >
    @if (isSaving()) {
    <fa-duotone-icon [icon]="faSpinner" animation="spin" class="mg-r-5" />
    {{ savingLabel() | translate }}
    } @else {
    <fa-icon [icon]="faFloppyDisk" class="mg-r-5" />
    {{ saveLabel() | translate }}
    }
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, NgClass, TranslateModule],
})
export class SaveButtonComponent {
  readonly faFloppyDisk = faFloppyDisk;
  readonly faSpinner = faSpinner;
  readonly disabled = input(false);
  readonly themeColor = input<ButtonThemeColor>('success');
  readonly cssClass = input<string | string[]>();
  readonly size = input<ButtonSize>('medium');
  readonly isSaving = input.required<boolean>();
  readonly saveLabel = input('General.Save');
  readonly savingLabel = input('General.Saving');
  readonly buttonClass = computed(() => {
    const results: string[] = [];
    const size = this.size();
    const cssClass = this.cssClass();

    if (size) results.push(`btn-${size}`);
    if (cssClass) {
      if (typeof cssClass === 'string') results.push(cssClass);
      else results.push(...cssClass);
    }

    return results;
  });
}

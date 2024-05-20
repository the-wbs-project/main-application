import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-save-button',
  template: `<button
    class="btn btn-success"
    [ngClass]="buttonClass()"
    [disabled]="disabled() || isSaving()"
  >
    @if (isSaving()) {
    <fa-duotone-icon [icon]="faSpinner" [spin]="true" /> &nbsp;
    {{ 'General.Saving' | translate }}
    } @else {
    <fa-icon [icon]="faFloppyDisk" class="mg-r-5" />
    {{ 'General.Save' | translate }}
    }
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class SaveButtonComponent {
  readonly faFloppyDisk = faFloppyDisk;
  readonly faSpinner = faSpinner;
  readonly disabled = input(false);
  readonly cssClass = input<string | string[]>();
  readonly size = input<'lg' | 'sm' | undefined>(undefined);
  readonly isSaving = input.required();
  readonly click = output<void>();
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

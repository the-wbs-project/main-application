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
    [ngClass]="sizeClass()"
    [disabled]="disabled() || isSaving()"
  >
    @if (isSaving()) {
    <fa-duotone-icon [icon]="faSpinner" [spin]="true" /> &nbsp;
    {{ 'General.Saving' | translate }}
    } @else {
    <fa-icon [icon]="faFloppyDisk" />&nbsp; {{ 'General.Save' | translate }}
    }
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class SaveButtonComponent {
  readonly faFloppyDisk = faFloppyDisk;
  readonly faSpinner = faSpinner;
  readonly disabled = input(false);
  readonly size = input<'lg' | 'sm' | undefined>(undefined);
  readonly isSaving = input.required();
  readonly click = output<void>();

  protected readonly sizeClass = computed(() => {
    const size = this.size();

    return size ? `btn-${size}` : '';
  });
}

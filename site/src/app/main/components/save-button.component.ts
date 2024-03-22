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
import { faCheck, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-save-button',
  template: `<button
    class="btn btn-success"
    [ngClass]="sizeClass()"
    [disabled]="state() === 'saving'"
  >
    @switch (state()) { @case ('ready') {
    <fa-icon [icon]="faFloppyDisk" />&nbsp; {{ 'General.Save' | translate }}
    } @case ('saving') {
    <fa-duotone-icon [icon]="faSpinner" [spin]="true" /> &nbsp;
    {{ 'General.Saving' | translate }}
    } @case ('saved') {
    <fa-icon [icon]="faCheck" /> &nbsp; {{ 'General.Saved' | translate }}
    } }
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class SaveButtonComponent {
  readonly faCheck = faCheck;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faSpinner = faSpinner;
  readonly size = input<'lg' | 'sm' | undefined>(undefined);
  readonly state = input.required<'ready' | 'saving' | 'saved'>();
  readonly click = output<void>();

  protected readonly sizeClass = computed(() => {
    const size = this.size();

    return size ? `btn-${size}` : '';
  });
}

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SaveState } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-save-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
  template: `<div
    class="d-inline-block text-success"
    [ngClass]="cssClass() ?? ''"
    [@fade]="show() ? 'in' : 'out'"
  >
    @if (showSaving()) {
    <fa-duotone-icon [icon]="spinnerIcon" class="mg-r-5" animation="spin" />
    {{ 'General.Saving' | translate }}
    } @else if (showSaved()) {
    <fa-icon [icon]="checkIcon" class="mg-r-5" />
    {{ 'General.Saved' | translate }}
    }
  </div>`,
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in <=> out', animate('1s ease-in-out')),
    ]),
  ],
})
export class SaveMessageComponent {
  readonly checkIcon = faCheck;
  readonly spinnerIcon = faSpinner;
  readonly state = input.required<SaveState>();
  readonly cssClass = input<string | string[]>();

  readonly showSaved = computed(() => this.state() === 'saved');
  readonly showSaving = computed(() => this.state() === 'saving');
  readonly show = computed(() => this.showSaved() || this.showSaving());
}

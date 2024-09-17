import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-options-view-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  template: `<div class="btn-group">
    <button
      class="btn"
      [class.btn-primary]="flag() === true"
      [class.bg-gray-300]="flag() !== true"
      (click)="flag.set(true)"
    >
      {{ 'General.Yes' | translate }}
    </button>
    <button
      class="btn"
      [class.btn-primary]="flag() === false"
      [class.bg-gray-300]="flag() !== false"
      (click)="flag.set(false)"
    >
      {{ 'General.No' | translate }}
    </button>
  </div>`,
})
export class OptionsViewButtonComponent {
  readonly flag = model.required<boolean | undefined>();
}

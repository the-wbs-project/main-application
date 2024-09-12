import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-abs-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, TranslateModule],
  template: `<kendo-buttongroup selection="single">
    <button
      kendoButton
      size="small"
      [selected]="view() === 'wbs'"
      [title]="'Wbs.WBS-Full' | translate"
      (click)="view.set('wbs')"
    >
      {{ 'Wbs.WBS' | translate }}
    </button>
    <button
      kendoButton
      size="small"
      [selected]="view() === 'abs'"
      [title]="'Wbs.ABS-Full' | translate"
      (click)="view.set('abs')"
    >
      {{ 'Wbs.ABS' | translate }}
    </button>
  </kendo-buttongroup>`,
})
export class WbsAbsButtonComponent {
  readonly view = model.required<'wbs' | 'abs'>();
}

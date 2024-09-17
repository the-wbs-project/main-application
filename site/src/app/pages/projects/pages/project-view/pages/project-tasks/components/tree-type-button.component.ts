import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-type-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, TranslateModule],
  template: `<kendo-buttongroup selection="single">
    <button
      kendoButton
      size="small"
      [selected]="view() === 'phases'"
      (click)="view.set('phases')"
    >
      {{ 'Projects.ByPhase' | translate }}
    </button>
    <button
      kendoButton
      size="small"
      [selected]="view() === 'disciplines'"
      (click)="view.set('disciplines')"
    >
      {{ 'Projects.ByDiscipline' | translate }}
    </button>
  </kendo-buttongroup>`,
})
export class TreeTypeButtonComponent {
  readonly view = model.required<'phases' | 'disciplines'>();
}

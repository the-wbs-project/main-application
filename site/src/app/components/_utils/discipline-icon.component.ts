import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { CategoryViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon',
  template: `<span class="mg-r-5" kendoTooltip [title]="item().label">
    <i class="fa-solid fa-sm" [ngClass]="item().icon"></i>
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TooltipModule],
})
export class DisciplineIconComponent {
  readonly item = input.required<CategoryViewModel>();
}

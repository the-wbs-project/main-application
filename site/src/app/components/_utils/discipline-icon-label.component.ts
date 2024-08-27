import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { CategoryViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-label',
  template: `<i class="fa-solid mg-r-5" [ngClass]="item().icon"></i>
    {{ item().label }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TooltipModule],
})
export class DisciplineIconLabelComponent {
  readonly item = input.required<CategoryViewModel>();
}

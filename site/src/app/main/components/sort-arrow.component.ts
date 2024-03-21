import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { State } from '@progress/kendo-data-query';
import { arrowDownIcon, arrowUpIcon } from '@progress/kendo-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-sort-arrow',
  template: `@if (state().sort![0].field === field() && state().sort![0].dir) {
    <kendo-svg-icon
      [icon]="state().sort![0].dir === 'asc' ? arrowDownIcon : arrowUpIcon"
    />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SVGIconModule],
})
export class SortArrowComponent {
  readonly state = input.required<State>();
  readonly field = input.required<string>();

  readonly arrowUpIcon = arrowUpIcon;
  readonly arrowDownIcon = arrowDownIcon;
}

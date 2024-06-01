import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { SortDescriptor } from '@progress/kendo-data-query';
import { arrowDownIcon, arrowUpIcon } from '@progress/kendo-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-sort-arrow',
  template: `@if (sort(); as list) { @if (list[0].field === field() &&
    list[0].dir) {
    <kendo-svg-icon
      [icon]="list[0].dir === 'asc' ? arrowDownIcon : arrowUpIcon"
    />
    }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SVGIconModule],
})
export class SortArrowComponent {
  readonly sort = input.required<SortDescriptor[]>();
  readonly field = input.required<string>();

  readonly arrowUpIcon = arrowUpIcon;
  readonly arrowDownIcon = arrowDownIcon;
}

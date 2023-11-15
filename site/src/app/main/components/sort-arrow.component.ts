import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { State } from '@progress/kendo-data-query';
import { arrowDownIcon, arrowUpIcon } from '@progress/kendo-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-sort-arrow',
  template: `@if (state.sort![0].field === field && state.sort![0].dir) {
    <kendo-svg-icon
      [icon]="state.sort![0].dir === 'asc' ? arrowDownIcon : arrowUpIcon"
    />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, SVGIconModule],
})
export class SortArrowComponent {
  @Input() state!: State;
  @Input() field!: string;

  readonly arrowUpIcon = arrowUpIcon;
  readonly arrowDownIcon = arrowDownIcon;
}

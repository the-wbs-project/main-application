import { Directive, input } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { TableHelper } from '../services';

@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
  providers: [TableHelper],
})
export class SortableDirective {
  readonly state = input.required<State>();
  readonly sortable = input.required<string>();

  constructor(private readonly service: TableHelper) {}

  rotate() {
    this.service.sort(this.state(), this.sortable());
  }
}

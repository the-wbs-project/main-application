import { Directive, input, model } from '@angular/core';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { TableHelper } from '@wbs/core/services';

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
  readonly sortColumns = model.required<SortDescriptor[]>();
  readonly sortable = input.required<string>();

  constructor(private readonly service: TableHelper) {}

  rotate() {
    this.sortColumns.update((list) => {
      this.service.sort2(list, this.sortable());

      return [...list];
    });
  }
}

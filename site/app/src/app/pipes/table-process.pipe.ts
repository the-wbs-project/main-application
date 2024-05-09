import { Pipe } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { TableHelper } from '../main/services';

@Pipe({ name: 'tableProcess', pure: false, standalone: true })
export class TableProcessPipe {
  constructor(private readonly tableHelper: TableHelper) {}

  transform<T>(data: T[] | undefined, state: State): T[] | undefined {
    if (data == undefined) return undefined;

    return this.tableHelper.process(data, state);
  }
}

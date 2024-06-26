import { Injectable } from '@angular/core';
import { SortDescriptor, State, process } from '@progress/kendo-data-query';

@Injectable()
export class TableHelper {
  static filter(state: State, columns: string[], filter: string): void {
    state.filter = {
      logic: 'or',
      filters: columns.map((x) => ({
        field: x,
        operator: 'contains',
        value: filter,
      })),
    };
  }

  sort(state: State, column: string): void {
    if (!state.sort) state.sort = [];

    if (state.sort.length === 0 || state.sort[0].field !== column) {
      state.sort.splice(0, 0, { field: column, dir: 'asc' });
      return;
    }
    state.sort[0].dir = state.sort[0].dir === 'asc' ? 'desc' : 'asc';
  }

  sort2(list: SortDescriptor[], column: string): void {
    if (list.length === 0 || list[0].field !== column) {
      list.splice(0, 0, { field: column, dir: 'asc' });
      return;
    }
    list[0].dir = list[0].dir === 'asc' ? 'desc' : 'asc';
  }

  process<T>(data: T[], state: State): T[] {
    return process(data, state).data;
  }
}

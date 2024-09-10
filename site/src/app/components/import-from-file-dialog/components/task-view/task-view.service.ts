import { Injectable } from '@angular/core';
import {
  CellClickEvent,
  ColumnComponent,
  TreeListComponent,
} from '@progress/kendo-angular-treelist';
import { ImportTask } from '../../models';

@Injectable()
export class TaskViewService {
  taskTitleChanged(
    treelist: TreeListComponent,
    item: ImportTask,
    title: string
  ): void {
    treelist.closeCell();

    item.title = title;
  }

  onCellClick(e: CellClickEvent): void {
    const column = <ColumnComponent>e.sender.columns.get(e.columnIndex);

    if (!e.isEdited && column?.field === 'disciplines') {
      e.sender.editCell(e.dataItem, e.columnIndex);
    }
  }
}

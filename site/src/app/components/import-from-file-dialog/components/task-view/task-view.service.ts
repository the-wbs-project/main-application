import { inject, Injectable } from '@angular/core';
import { Messages } from '@wbs/core/services';
import { ImportTask } from '../../models';
import {
  CellClickEvent,
  ColumnComponent,
  TreeListComponent,
} from '@progress/kendo-angular-treelist';
import { map, Observable } from 'rxjs';

@Injectable()
export class TaskViewService {
  private readonly messages = inject(Messages);

  removeTaskAsync(task: ImportTask): Observable<string[] | undefined> {
    return this.messages.confirm
      .show(
        'General.Confirm',
        'Are you sure you want to remove this task (and any sub-tasks)?'
      )
      .pipe(
        map((answer) => (answer ? [task.id, ...(task.childrenIds ?? [])] : []))
      );
  }

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

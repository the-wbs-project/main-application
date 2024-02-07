import { Injectable } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { TaskCreationResults } from '@wbs/main/models';
import { DialogService } from '@wbs/main/services';
import { Observable } from 'rxjs';
import { TaskCreateComponent } from './task-create.component';

@Injectable()
export class TaskCreateService {
  constructor(private readonly dialog: DialogService) {}

  open(
    categories: ProjectCategory[]
  ): Observable<TaskCreationResults | undefined> {
    return this.dialog.openDialog<TaskCreationResults>(
      TaskCreateComponent,
      {
        size: 'xl',
        scrollable: true,
      },
      categories
    );
  }
}

import { Injectable } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { DialogService } from '@wbs/main/services';
import { Observable } from 'rxjs';
import { TaskCreateComponent } from './task-create.component';
import { TaskCreationResults } from './task-creation-results.model';

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

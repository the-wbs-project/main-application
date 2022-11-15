import { Injectable } from '@angular/core';
import { WbsNode } from '@wbs/core/models';
import { DialogService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { TaskCreateComponent } from './task-create.component';

@Injectable()
export class TaskCreateService {
  constructor(private readonly dialog: DialogService) {}

  open(): Observable<{ model: Partial<WbsNode>; nav: boolean } | undefined> {
    return this.dialog.openDialog<{ model: Partial<WbsNode>; nav: boolean }>(
      TaskCreateComponent
    );
  }
}

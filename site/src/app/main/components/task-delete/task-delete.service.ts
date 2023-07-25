import { Injectable } from '@angular/core';
import { DialogService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { TaskDeleteComponent } from './task-delete.component';

@Injectable()
export class TaskDeleteService {
  constructor(private readonly dialog: DialogService) {}

  open(): Observable<string | undefined> {
    return this.dialog.openDialog<string>(TaskDeleteComponent);
  }
}

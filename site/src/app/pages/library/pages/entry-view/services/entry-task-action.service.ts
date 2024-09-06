import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NameVisibilityComponent } from '@wbs/components/entry-creation/components/name-visibility';
import { EntryTaskService } from '@wbs/core/services/library';
import { Observable } from 'rxjs';
import { LibraryImportService } from './library-import.service';

@Injectable()
export class EntryTaskActionService {
  private readonly dialogService = inject(DialogService);
  private readonly importService = inject(LibraryImportService);
  private readonly taskService = inject(EntryTaskService);

  onAction(action: string, taskId: string): Observable<any> | void {
    if (action === 'moveLeft') {
      return this.taskService.moveTaskLeft(taskId);
    } else if (action === 'moveUp') {
      return this.taskService.moveTaskUp(taskId);
    } else if (action === 'moveRight') {
      return this.taskService.moveTaskRight(taskId);
    } else if (action === 'moveDown') {
      return this.taskService.moveTaskDown(taskId);
    } else if (action === 'deleteTask') {
      return this.taskService.removeTask(taskId);
    } else if (action === 'cloneTask') {
      return this.taskService.cloneTask(taskId);
    } else if (action === 'export') {
      NameVisibilityComponent.launch(this.dialogService, taskId);
    } else if (action.startsWith('import|file')) {
      return this.importService.importFromFileAsync(taskId);
    } else if (action.startsWith('import|library')) {
      return this.importService.importFromLibraryAsync(taskId);
    }
  }
}

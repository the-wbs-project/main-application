import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NameVisibilityComponent } from '@wbs/components/entry-creation/components/name-visibility';
import { LibraryListModalComponent } from '@wbs/components/library/list-modal';
import { EntryTaskService } from '@wbs/core/services/library';
import { MembershipStore, UserStore } from '@wbs/core/store';
import { LibraryImportResults } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LibraryImportProcessorService } from './library-import-processor.service';

@Injectable()
export class EntryTaskActionService {
  private readonly dialogService = inject(DialogService);
  private readonly importProcessor = inject(LibraryImportProcessorService);
  private readonly membership = inject(MembershipStore);
  private readonly taskService = inject(EntryTaskService);
  private readonly userId = inject(UserStore).userId;

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
    } else if (action.startsWith('import|')) {
      const direction = action.split('|')[1]!;

      return LibraryListModalComponent.launchAsync(
        this.dialogService,
        this.membership.membership()!.name,
        this.userId()!,
        'internal'
      ).pipe(
        switchMap((results: LibraryImportResults | undefined) =>
          !results
            ? of(false)
            : this.importProcessor
                .importAsync(taskId, direction, results)
                .pipe(map(() => true))
        )
      );
    }
  }
}

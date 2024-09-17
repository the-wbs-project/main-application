import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskDeleteResults } from './task-delete-results.model';

const otherId = 'delete_other';

@Component({
  standalone: true,
  templateUrl: './task-delete-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule, TranslateModule],
})
export class TaskDeleteConfirmDialogComponent extends DialogContentBase {
  //
  //    Inputs
  //
  readonly requireReason = signal(false);
  readonly canDelete = computed(() => {
    if (!this.requireReason()) return true;

    const reason = this.reason();

    if (reason && reason !== otherId) return true;

    return this.reasonText().length > 0;
  });
  //
  //    Signals
  //
  readonly reason = signal<string | undefined>(undefined);
  readonly reasonText = signal('');

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialogService: DialogService,
    requireReason: boolean
  ): Observable<TaskDeleteResults | undefined> {
    const dialogRef = dialogService.open({
      content: TaskDeleteConfirmDialogComponent,
    });

    const comp = dialogRef.content.instance as TaskDeleteConfirmDialogComponent;

    comp.requireReason.set(requireReason);

    return dialogRef.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : (x as TaskDeleteResults)
      )
    );
  }

  deleteTask(deleteSubTasks: boolean) {
    let reason = this.reason();

    if (reason === otherId) reason = this.reasonText();

    this.dialog.close({ deleteSubTasks, reason });
  }
}

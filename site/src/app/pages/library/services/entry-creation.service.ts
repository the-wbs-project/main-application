import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NameVisibilityComponent } from '@wbs/components/entry-creation/components/name-visibility';
import { EntryPhaseCreationComponent } from '@wbs/components/entry-creation/phase';
import { EntryProjectCreationComponent } from '@wbs/components/entry-creation/project';
import { EntryTaskCreationComponent } from '@wbs/components/entry-creation/task';

@Injectable()
export class EntryCreationService {
  private readonly dialog = inject(DialogService);

  runAsync(type: string): void {
    this.dialog.open({
      content:
        type === 'task'
          ? EntryTaskCreationComponent
          : type === 'phase'
          ? EntryPhaseCreationComponent
          : EntryProjectCreationComponent,
    });
  }

  exportTaskToEntryAsync(taskId: string): void {
    const dialogRef = this.dialog.open({ content: NameVisibilityComponent });
    const comp: NameVisibilityComponent = dialogRef.content.instance;

    comp.setup(taskId);
  }
}

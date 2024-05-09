import { Injectable, WritableSignal, inject } from '@angular/core';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { NameVisibilityComponent } from '@wbs/components/entry-creation/name-visibility';
import { EntryPhaseCreationComponent } from '@wbs/components/entry-creation/phase';
import { EntryProjectCreationComponent } from '@wbs/components/entry-creation/project';
import { EntryTaskCreationComponent } from '@wbs/components/entry-creation/task';
import { EntryCreationModel, LibraryEntryVersion } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class EntryCreationService {
  private readonly dialog = inject(DialogService);

  runAsync(owner: string, type: string): Observable<EntryCreationModel> {
    const dialogRef = this.dialog.open({
      content:
        type === 'task'
          ? EntryTaskCreationComponent
          : type === 'phase'
          ? EntryPhaseCreationComponent
          : EntryProjectCreationComponent,
    });

    const comp: { owner: WritableSignal<string> } = dialogRef.content.instance;

    comp.owner.set(owner);

    return dialogRef.result.pipe(
      filter((x) => !(x instanceof DialogCloseResult)),
      map((x) => <EntryCreationModel>x)
    );
  }

  exportTaskToEntryAsync(taskId: string): void {
    const dialogRef = this.dialog.open({ content: NameVisibilityComponent });
    const comp: NameVisibilityComponent = dialogRef.content.instance;

    comp.setup(taskId);
  }
}

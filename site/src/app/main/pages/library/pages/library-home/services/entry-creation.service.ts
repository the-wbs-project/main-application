import { Injectable, WritableSignal, inject } from '@angular/core';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EntryPhaseCreationComponent } from '../components/entry-phase-creation';
import { EntryProjectCreationComponent } from '../components/entry-project-creation';
import { EntryTaskCreationComponent } from '../components/entry-task-creation';
import { EntryCreationModel } from '../models';

@Injectable()
export class EntryCreationService {
  private readonly dialog = inject(DialogService);

  runAsync(owner: string, type: string): Observable<EntryCreationModel> {
    console.log(type);
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
}

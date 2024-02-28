import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Resources } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EntryPhaseCreationComponent } from '../components/entry-phase-creation';
import { EntryTaskCreationComponent } from '../components/entry-task-creation';
import { EntryCreationModel } from '../models';

@Injectable()
export class EntryCreationService {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly resources = inject(Resources);
  private readonly store = inject(Store);

  runAsync(owner: string, type: string): Observable<EntryCreationModel> {
    let dialogRef: DialogRef | undefined;

    if (type === 'task') {
      dialogRef = this.dialog.open({
        content: EntryTaskCreationComponent,
      });

      (<EntryTaskCreationComponent>dialogRef.content.instance).owner.set(owner);
    } else {
      dialogRef = this.dialog.open({
        content: EntryPhaseCreationComponent,
      });

      (<EntryPhaseCreationComponent>dialogRef.content.instance).owner.set(
        owner
      );
    }
    return dialogRef.result.pipe(
      filter((x) => !(x instanceof DialogCloseResult)),
      map((x) => <EntryCreationModel>x)
    );
  }
}

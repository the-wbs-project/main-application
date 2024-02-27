import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Resources } from '@wbs/core/services';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { EntryTaskCreationComponent } from '../components/entry-task-creation';
import { EntryCreationModel } from '../models';

@Injectable()
export class EntryCreationService {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly resources = inject(Resources);
  private readonly store = inject(Store);

  runAsync(owner: string, type: string): Observable<EntryCreationModel> {
    const dialogRef = this.dialog.open({
      content: EntryTaskCreationComponent,
    });

    (<EntryTaskCreationComponent>dialogRef.content.instance).owner.set(owner);

    return dialogRef.result.pipe(
      filter((x) => !(x instanceof DialogCloseResult)),
      map((x) => <EntryCreationModel>x)
    );
  }
}

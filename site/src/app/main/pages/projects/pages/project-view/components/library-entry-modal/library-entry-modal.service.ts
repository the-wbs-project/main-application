import { Injectable } from '@angular/core';
import { DialogService } from '@wbs/main/services';
import { Observable } from 'rxjs';
import { LibraryEntryModalModel } from '../../models';
import { LibraryEntryModalComponent } from './library-entry-modal.component';

@Injectable()
export class TaskCreateService {
  constructor(private readonly dialog: DialogService) {}

  open(
    data: LibraryEntryModalModel
  ): Observable<LibraryEntryModalModel | undefined> {
    return this.dialog.openDialog<LibraryEntryModalModel>(
      LibraryEntryModalComponent,
      {
        size: 'xl',
        scrollable: true,
      },
      data
    );
  }
}

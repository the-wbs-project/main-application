import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { tap } from 'rxjs';
import { UploadFileService } from '../../services';

@Component({
  templateUrl: './project-node-upload-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectNodeUploadDialogComponent extends DialogContentBase {
  constructor(dialog: DialogRef, private readonly service: UploadFileService) {
    super(dialog);
  }

  selected(e: SelectEvent) {
    this.service
      .getFile(e)
      .pipe(tap((buffer) => this.dialog.close(buffer)))
      .subscribe();
  }

  close() {
    this.dialog.close();
  }
}

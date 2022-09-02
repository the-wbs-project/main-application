import { Component, ViewEncapsulation } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';

@Component({
  templateUrl: './label-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LabelDialogComponent extends DialogContentBase {
  title?: string;
  message?: string;
  value?: string;
  width = 450;

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  close(value: string | null | undefined) {
    this.dialog.close(value);
  }
}

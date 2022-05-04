import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { ListItem } from '@wbs/shared/models';
import { Resources } from '@wbs/shared/services';

@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsNodeDeleteComponent extends DialogContentBase {
  dReason: ListItem | undefined;
  dOther = '';

  constructor(dialog: DialogRef, private readonly resources: Resources) {
    super(dialog);
  }

  closeDelete() {
    this.dialog.close(null);
  }

  finishDelete() {
    let reason: string | null = null;
    if (this.dReason)
      if (this.dReason.id === 'delete-other') {
        reason = this.dOther.trim();
      } else {
        reason = this.resources.get(this.dReason.label);
      }
    this.dialog.close(reason);
  }
}

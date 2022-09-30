import { Component, ViewEncapsulation } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { ListItem } from '@wbs/shared/models';
import { Resources } from '@wbs/shared/services';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WbsNodeDeleteComponent extends DialogContentBase {
  readonly reasons$ = new BehaviorSubject<ListItem[]>([]);
  dReason: ListItem | undefined;
  dOther = '';
  dOtherId = 'delete_other';

  constructor(dialog: DialogRef, private readonly resources: Resources) {
    super(dialog);
  }

  closeDelete() {
    this.dialog.close(null);
  }

  finishDelete() {
    let reason: string | null = null;
    if (this.dReason)
      if (this.dReason.id === this.dOtherId) {
        reason = this.dOther.trim();
      } else {
        reason = this.resources.get(this.dReason.label);
      }
    this.dialog.close(reason);
  }
}

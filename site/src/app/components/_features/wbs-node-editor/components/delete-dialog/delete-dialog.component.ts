import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ListItem } from '@wbs/models';
import { Resources } from '@wbs/services';

@Component({
  selector: 'wbs-node-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DeleteDialogComponent {
  @Input() open = false;
  @Output() readonly nodeDeleted = new EventEmitter<string | null>();

  dReason: ListItem | undefined;
  dOther = '';

  constructor(private readonly resources: Resources) {}

  closeDelete() {
    this.nodeDeleted.emit(null);
  }

  finishDelete() {
    let reason: string | null = null;
    if (this.dReason)
      if (this.dReason.id === 'delete-other') {
        reason = this.dOther.trim();
      } else {
        reason = this.resources.get(this.dReason.label);
      }
    this.nodeDeleted.emit(reason);
  }
}

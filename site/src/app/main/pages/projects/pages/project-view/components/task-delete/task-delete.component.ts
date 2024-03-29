import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ListItem } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  templateUrl: './task-delete.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgbModalModule, TranslateModule],
})
export class TaskDeleteComponent {
  reason = 'none';
  dOtherId = 'delete_other';

  readonly reasons = toSignal(
    this.data.metdata
      .getListAsync<ListItem>('delete_reasons')
      .pipe(map((list) => list.sort((a, b) => a.order - b.order)))
  );

  constructor(
    readonly modal: NgbActiveModal,
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  finishDelete(dReasonId: string, otherReasonText: string) {
    if (dReasonId)
      if (dReasonId === this.dOtherId) {
        this.modal.close(otherReasonText.trim());
      } else {
        const dReason = this.reasons()!.find((x) => x.id === dReasonId)!;

        this.modal.close(this.resources.get(dReason.label));
      }
  }
}

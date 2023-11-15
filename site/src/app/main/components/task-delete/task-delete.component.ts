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
import { TaskDeleteService } from './task-delete.service';

@Component({
  standalone: true,
  templateUrl: './task-delete.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgbModalModule, TranslateModule],
  providers: [TaskDeleteService],
})
export class TaskDeleteComponent implements OnInit {
  reason = 'none';
  dOtherId = 'delete_other';

  readonly reasons = signal<ListItem[]>([]);

  constructor(
    readonly modal: NgbActiveModal,
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  ngOnInit(): void {
    this.data.metdata
      .getListAsync<ListItem>('delete_reasons')
      .subscribe((list) => this.reasons.set(list));
  }

  finishDelete(dReasonId: string, otherReasonText: string) {
    if (dReasonId)
      if (dReasonId === this.dOtherId) {
        this.modal.close(otherReasonText.trim());
      } else {
        const dReason = this.reasons().find((x) => x.id === dReasonId)!;

        this.modal.close(this.resources.get(dReason.label));
      }
  }
}

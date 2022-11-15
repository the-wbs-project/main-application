import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ListItem } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './task-delete.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TaskDeleteComponent implements OnInit {
  reason = 'none';
  dOtherId = 'delete_other';

  readonly reasons$ = new BehaviorSubject<ListItem[]>([]);

  constructor(
    readonly modal: NgbActiveModal,
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  ngOnInit(): void {
    this.data.metdata
      .getListAsync<ListItem>('delete_reasons')
      .subscribe((list) => this.reasons$.next(list));
  }

  finishDelete(dReasonId: string, otherReasonText: string) {
    if (dReasonId)
      if (dReasonId === this.dOtherId) {
        this.modal.close(otherReasonText.trim());
      } else {
        const dReason = this.reasons$
          .getValue()
          .find((x) => x.id === dReasonId)!;

        this.modal.close(this.resources.get(dReason.label));
      }
  }
}

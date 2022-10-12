import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ListItem } from '@wbs/shared/models';
import { DataServiceFactory, Resources } from '@wbs/shared/services';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wbs-task-delete-dialog',
  templateUrl: './task-delete-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TaskDeleteDialogComponent implements OnInit {
  dOtherId = 'delete_other';

  readonly reasons$ = new BehaviorSubject<ListItem[]>([]);

  constructor(
    public readonly modal: NgbActiveModal,
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

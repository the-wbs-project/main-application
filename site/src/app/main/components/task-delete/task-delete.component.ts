import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ListItem } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { BehaviorSubject } from 'rxjs';
import { TaskDeleteService } from './task-delete.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './task-delete.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, NgbModalModule, TranslateModule],
  providers: [TaskDeleteService]
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

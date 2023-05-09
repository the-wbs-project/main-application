import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TaskViewState } from '../../states';

@UntilDestroy()
@Component({
  selector: 'wbs-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskModalComponent implements AfterContentInit {
  @ViewChild('taskContent') taskContent!: any;

  private modal?: NgbModalRef;

  readonly previousTaskId$ = this.store.select(TaskViewState.previousTaskId);
  readonly nextTaskId$ = this.store.select(TaskViewState.nextTaskId);

  constructor(
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {} 

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.store
        .select(RouterState.url)
        .pipe(untilDestroyed(this))
        .subscribe((url) => {
          if (!url) return;

          const parts = url.split('/');

          if (parts[parts.length - 3]?.toLowerCase() === 'task') {
            if (!this.modal) {
              this.modal = this.modalService.open(this.taskContent, {
                modalDialogClass: 'task-modal',
                size: 'fullscreen',
              });
              const sub = this.modal.dismissed.subscribe(() => {
                this.modal = undefined;
                sub.unsubscribe();
              });
            }
          } else if (this.modal) {
            this.modal.close();
            this.modal = undefined;
          }
        });
    }, 250);
  }
}

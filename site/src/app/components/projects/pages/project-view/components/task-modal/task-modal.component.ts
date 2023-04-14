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
import { Observable } from 'rxjs';
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
  readonly previousTaskId$: Observable<string | undefined>;
  readonly nextTaskId$: Observable<string | undefined>;
  private modal?: NgbModalRef;

  constructor(
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {
    this.nextTaskId$ = this.store.select(TaskViewState.nextTaskId);
    this.previousTaskId$ = this.store.select(TaskViewState.previousTaskId);
  }

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
              this.modal.dismissed.pipe(untilDestroyed(this)).subscribe(() => {
                this.modal = undefined;
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

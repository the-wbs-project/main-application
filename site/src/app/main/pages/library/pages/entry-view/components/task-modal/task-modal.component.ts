import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { WbsNodeView } from '@wbs/core/view-models';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-entry-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule, TranslateModule],
})
export class EntryTaskModalComponent implements AfterContentInit {
  @ViewChild('taskContent') taskContent!: any;
  @Output() readonly dismissed = new EventEmitter<void>();

  private modal?: NgbModalRef;

  readonly task = input.required<WbsNodeView | undefined>();

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

          const parts = url.toLowerCase().split('/');
          const taskId = this.task()?.id?.toLowerCase();

          if (
            taskId &&
            parts.includes('tasks') &&
            parts.indexOf('tasks') < parts.length - 1 &&
            parts.includes(taskId)
          ) {
            if (!this.modal) {
              this.modal = this.modalService.open(this.taskContent, {
                modalDialogClass: 'task-modal',
                size: 'fullscreen',
              });
              this.modal.dismissed.subscribe(() => {
                this.dismissed.emit();
                //this.navigation.toProjectPage(PROJECT_PAGES.TASKS);
                this.modal = undefined;
              });
            }
          } else if (this.modal) {
            this.modal.close();
            this.modal = undefined;
          }
        });
    }, 150);
  }
}

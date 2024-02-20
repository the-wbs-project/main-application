import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { RouterState } from '@ngxs/router-plugin';
import { SignalStore } from '@wbs/core/services';
import { EntryViewState } from '../../../../states';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-entry-task-modal',
  templateUrl: './task-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslateModule],
})
export class TaskModalComponent implements AfterContentInit {
  @ViewChild('taskContent') taskContent!: any;
  @Output() readonly dismissed = new EventEmitter<void>();

  private readonly modalService = inject(NgbModal);
  private readonly store = inject(SignalStore);

  private modal?: NgbModalRef;

  readonly faDiagramSubtask = faDiagramSubtask;
  readonly task = this.store.select(EntryViewState.taskVm);

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.store
        .selectAsync(RouterState.url)
        .pipe(untilDestroyed(this))
        .subscribe((url) => {
          if (!url) return;

          const parts = url.toLowerCase().split('/');

          if (
            parts.indexOf('tasks') !== -1 &&
            parts.indexOf('tasks') < parts.length - 1
          ) {
            if (!this.modal) {
              this.modal = this.modalService.open(this.taskContent, {
                modalDialogClass: 'task-modal',
                size: 'fullscreen',
              });
              this.modal.dismissed.subscribe(() => {
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

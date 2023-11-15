import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PROJECT_PAGES } from '../../models';
import { ProjectNavigationService } from '../../services';
import { TasksState } from '../../states';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class TaskModalComponent implements AfterContentInit {
  @ViewChild('taskContent') taskContent!: any;

  private modal?: NgbModalRef;

  readonly task = toSignal(this.store.select(TasksState.current));

  constructor(
    private readonly modalService: NgbModal,
    private readonly navigation: ProjectNavigationService,
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
                this.navigation.toProjectPage(PROJECT_PAGES.TASKS);
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

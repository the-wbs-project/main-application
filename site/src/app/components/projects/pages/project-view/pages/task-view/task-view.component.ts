import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { TaskDeleteService } from '@wbs/components/_features/task-delete';
import { WbsNode } from '@wbs/core/models';
import { TitleService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { ChangeTaskTitle, RemoveTask } from '../../../../actions';
import { TASK_MENU_ITEMS, TASK_PAGE_VIEW_TYPE } from '../../models';
import { TaskViewState } from '../../states';

@Component({
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskViewComponent {
  @Select(TaskViewState.current) current$!: Observable<WbsNode>;
  @Select(TaskViewState.pageView) pageView$!: Observable<TASK_PAGE_VIEW_TYPE>;

  readonly links = TASK_MENU_ITEMS.links;
  readonly actions = TASK_MENU_ITEMS.actions;

  constructor(
    title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly taskDelete: TaskDeleteService
  ) {
    title.setTitle('Project', false);
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  private get taskId(): string {
    return this.route.snapshot.params['taskId'];
  }

  actionClicked(action: string): void {
    if (action === 'addSub') {
      //this.store.dispatch(new CreateTask(this.taskId));
    } else if (action === 'delete') {
      this.taskDelete.open().subscribe((reason) => {
        if (this.taskId && reason)
          this.store.dispatch(
            new RemoveTask(
              this.taskId,
              reason,
              new Navigate(['/projects', this.projectId, 'view', 'phases'])
            )
          );
      });
    }
  }

  saveTitle(newTitle: string): void {
    this.store.dispatch(new ChangeTaskTitle(this.taskId, newTitle));
  }
}

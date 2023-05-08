import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { RemoveTask } from '@wbs/components/projects/actions';
import { TaskDeleteService } from '@wbs/components/_features/task-delete';
import { WbsNodeView } from '@wbs/core/view-models';
import { TASK_MENU_ITEMS } from '../../models';
import { ProjectNavigationService, ProjectViewService } from '../../services';

@Component({
  selector: 'wbs-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent {
  @Input() projectId!: string;
  @Input() task!: WbsNodeView;
  @Input() parent?: WbsNodeView | null;

  readonly actions = TASK_MENU_ITEMS.actions;

  constructor(
    readonly nav: ProjectNavigationService,
    readonly service: ProjectViewService,
    private readonly store: Store,
    private readonly taskDelete: TaskDeleteService
  ) {}

  actionClicked(action: string): void {
    if (action === 'deleteTask') {
      this.taskDelete.open().subscribe((reason) => {
        if (reason)
          this.store.dispatch(
            new RemoveTask(this.task.id, reason, this.nav.getProjectNavAction())
          );
      });
    } else {
      this.service.action(action, this.task.id);
    }
  }
}

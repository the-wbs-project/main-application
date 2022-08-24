import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Project, PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wbs-task-sub-tasks',
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskSubTasksComponent implements OnChanges {
  @Input() phase?: WbsNodeView | null;
  @Input() project?: Project | null;
  @Input() subTasks?: WbsNodeView[] | null;
  @Input() width?: number | null;

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
  readonly tasks$ = new BehaviorSubject<WbsNodeView[]>([]);

  ngOnChanges(): void {
    let views: WbsNodeView[] = [];

    if (this.phase && this.subTasks) {
      views = JSON.parse(JSON.stringify(this.subTasks));

      for (const task of views) {
        if (task.parentId !== this.phase.id) continue;

        task.parentId = null;
        task.treeParentId = null;
      }
    }

    this.tasks$.next(views);
  }
}

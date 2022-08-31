import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Project, PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';

@Component({
  selector: 'wbs-task-sub-tasks',
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskSubTasksComponent {
  @Input() project?: Project | null;
  @Input() subTasks?: WbsNodeView[] | null;
  @Input() width?: number | null;

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;
}

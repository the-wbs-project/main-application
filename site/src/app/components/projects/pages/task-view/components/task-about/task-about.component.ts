import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { WbsNode } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

@Component({
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskAboutComponent {
  @Input() current?: WbsNode | null;
  @Input() discipline?: WbsNodeView | null;
  @Input() phase?: WbsNodeView | null;
  @Input() subTasks?: WbsNodeView[] | null;
}

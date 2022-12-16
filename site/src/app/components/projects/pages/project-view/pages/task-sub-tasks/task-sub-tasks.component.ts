import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Project, PROJECT_NODE_VIEW } from '@wbs/core/models';
import { UiState } from '@wbs/core/states';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ProjectState } from '../../../../states';
import { ProjectNavigationService } from '../../services';
import { TaskViewState } from '../../states';

@Component({
  selector: 'wbs-task-sub-tasks',
  templateUrl: './task-sub-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskSubTasksComponent {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(TaskViewState.subTasks) subTasks$!: Observable<WbsNodeView[] | null>;
  @Input() width?: number | null;

  readonly phaseView = PROJECT_NODE_VIEW.PHASE;

  constructor(public readonly navigate: ProjectNavigationService) {}
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { WbsTreeComponent } from '@wbs/main/components/wbs-tree';
import { ProjectViewService } from '../../../../../services';
import { ProjectState, TasksState } from '../../../../../states';
import { Project } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-project-discipline-tree',
  templateUrl: './discipline-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WbsTreeComponent],
})
export class ProjectDisciplinesTreeComponent {
  @Input({ required: true }) project?: Project;

  taskId?: string;

  readonly disciplines = toSignal(this.store.select(TasksState.disciplines));
  readonly disciplineIds = toSignal(
    this.store.select(ProjectState.disciplineIds)
  );

  constructor(readonly service: ProjectViewService, readonly store: Store) {}
}

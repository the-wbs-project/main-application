import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { WbsTreeComponent } from '@wbs/main/components/wbs-tree';
import { ProjectViewService } from '../../../services';
import { ProjectState, TasksState } from '../../../states';

@Component({
  standalone: true,
  templateUrl: './project-disciplines-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WbsTreeComponent],
})
export class ProjectDisciplinesPageComponent {
  taskId?: string;

  readonly project = toSignal(this.store.select(ProjectState.current));
  readonly disciplines = toSignal(this.store.select(TasksState.disciplines));
  readonly disciplineIds = toSignal(
    this.store.select(ProjectState.disciplineIds)
  );

  constructor(readonly service: ProjectViewService, readonly store: Store) {}
}

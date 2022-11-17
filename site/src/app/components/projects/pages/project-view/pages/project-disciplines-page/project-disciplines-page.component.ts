import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ProjectState } from '../../../../states';
import { ProjectViewService } from '../../services';

@Component({
  templateUrl: './project-disciplines-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDisciplinesPageComponent {
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectState.disciplines) disciplines$!: Observable<WbsNodeView[]>;
  taskId?: string;

  constructor(readonly service: ProjectViewService) {}
}

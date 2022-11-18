import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { UiState } from '@wbs/core/states';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ProjectState } from '../../../../states';
import { ProjectViewService } from '../../services';

@Component({
  templateUrl: './project-phases-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPhasesPageComponent {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectState.phases) phases$!: Observable<WbsNodeView[]>;
  @Select(ProjectState.phaseIds) phaseIds$!: Observable<string[]>;
  taskId?: string;

  constructor(readonly service: ProjectViewService) {}
}

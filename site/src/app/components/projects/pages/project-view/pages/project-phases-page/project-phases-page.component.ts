import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Project, WbsNode } from '@wbs/core/models';
import { UiState } from '@wbs/core/states';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ProjectState } from '../../../../states';
import { ProjectNavigationService, ProjectViewService } from '../../services';
import { TaskViewState } from '../../states';

@Component({
  templateUrl: './project-phases-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPhasesPageComponent {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectState.phases) phases$!: Observable<WbsNodeView[]>;
  @Select(ProjectState.phaseIds) phaseIds$!: Observable<string[]>;
  @Select(TaskViewState.current) task$!: Observable<WbsNode | null>;
  @ViewChild('taskContent') taskContent!: any;
  taskId?: string;

  constructor(
    readonly navigate: ProjectNavigationService,
    readonly service: ProjectViewService
  ) {}
}

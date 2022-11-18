import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { TitleService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { ProjectState } from '../../states';
import { MenuItems, PAGE_VIEW_TYPE } from './models';
import { ProjectViewService } from './services';
import { ProjectViewState } from './states';

@Component({
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewLayoutComponent {
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectViewState.pageView) pageView$!: Observable<PAGE_VIEW_TYPE>;

  readonly links = MenuItems.projectLinks;
  readonly actions = MenuItems.phaseActions;

  constructor(title: TitleService, readonly service: ProjectViewService) {
    title.setTitle('Project', false);
  }
}

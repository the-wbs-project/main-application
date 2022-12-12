import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { TitleService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { ProjectState } from '../../states';
import { PROJECT_MENU_ITEMS, PROJECT_PAGE_VIEW_TYPE } from './models';
import { ProjectViewService } from './services';
import { ProjectViewState } from './states';

@Component({
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewLayoutComponent {
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectViewState.pageView)
  pageView$!: Observable<PROJECT_PAGE_VIEW_TYPE>;

  readonly links = PROJECT_MENU_ITEMS.projectLinks;
  readonly actions = PROJECT_MENU_ITEMS.phaseActions;

  constructor(title: TitleService, readonly service: ProjectViewService) {
    title.setTitle('Project', false);
  }
}

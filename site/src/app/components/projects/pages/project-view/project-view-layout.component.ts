import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { ProjectState } from '../../states';
import { PROJECT_MENU_ITEMS } from './models';
import { ProjectViewService } from './services';
import { ProjectViewState } from './states';

@Component({
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewLayoutComponent {
  readonly project$ = this.store.select(ProjectState.current);
  readonly pageView$ = this.store.select(ProjectViewState.pageView);

  readonly links = PROJECT_MENU_ITEMS.projectLinks;
  readonly actions = PROJECT_MENU_ITEMS.phaseActions;

  constructor(
    title: TitleService,
    readonly service: ProjectViewService,
    readonly store: Store
  ) {
    title.setTitle('Project', false);
  }
}

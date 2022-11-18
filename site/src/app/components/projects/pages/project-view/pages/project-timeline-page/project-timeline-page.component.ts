import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { ProjectTimelineState } from '@wbs/components/projects/states';
import {
  Project,
  PROJECT_NODE_VIEW_TYPE,
  TimelineMenuItem,
} from '@wbs/core/models';
import { TitleService } from '@wbs/core/services';
import { UiState } from '@wbs/core/states';
import { TimelineViewModel, WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ProjectViewService } from '../../services';

@Component({
  templateUrl: './project-timeline-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTimelinePageComponent {
  @Select(ProjectTimelineState.project) timeline$!: Observable<
    TimelineViewModel[]
  >;

  constructor(
    private readonly route: ActivatedRoute,
    readonly service: ProjectViewService
  ) {}

  get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }
}

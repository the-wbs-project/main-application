import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { TimelineComponent } from '@wbs/main/components/timeline';
import { ProjectViewService } from '../services';
import { ProjectTimelineState } from '../states';

@Component({
  standalone: true,
  template: `<wbs-timeline
    [timeline]="timeline()"
    (loadMoreClicked)="service.loadMoreTimeline()"
    (menuItemClicked)="service.timelineAction($event, projectId)"
  /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent],
})
export class ProjectTimelinePageComponent {
  readonly timeline = toSignal(this.store.select(ProjectTimelineState.project));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    readonly service: ProjectViewService
  ) {}

  get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }
}

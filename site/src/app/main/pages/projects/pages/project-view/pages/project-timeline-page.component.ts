import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { TimelineComponent } from '@wbs/main/components/timeline';
import { TimelineMenuItem } from '@wbs/core/models';
import { TimelineViewModel } from '@wbs/core/view-models';
import { ProjectNavigationService, TimelineService } from '../services';
import { ProjectState } from '../states';

@Component({
  standalone: true,
  template: `<wbs-timeline
    [timeline]="timeline()"
    (loadMoreClicked)="loadMore()"
    (menuItemClicked)="timelineAction($event)"
  /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent],
})
export class ProjectTimelinePageComponent implements OnInit {
  readonly timeline: WritableSignal<TimelineViewModel[]> = signal([]);

  constructor(
    private readonly nav: ProjectNavigationService,
    private readonly store: Store,
    private readonly timelineService: TimelineService
  ) {}

  ngOnInit(): void {
    this.loadMore();
  }

  timelineAction(item: TimelineMenuItem) {
    if (item.action === 'navigate') {
      this.nav.toTask(item.objectId);
    } else if (item.action === 'restore') {
      //this.store.dispatch(new RestoreProject(item.activityId));
    }
  }

  loadMore(): void {
    const timeline = this.timeline();
    const projectId = this.store.selectSnapshot(ProjectState.current)!.id;

    this.timelineService
      .loadMore(timeline, projectId)
      .subscribe((newTimeline) => this.timeline.set([...newTimeline]));
  }
}

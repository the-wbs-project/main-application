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
import { TASK_PAGES } from '../models';

@Component({
  standalone: true,
  template: `<wbs-timeline
    [length]="length()"
    [loaded]="loaded()"
    [loading]="loading()"
    [timeline]="timeline()"
    (loadMoreClicked)="loadMore()"
    (menuItemClicked)="timelineAction($event)"
  /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent],
})
export class ProjectTimelinePageComponent implements OnInit {
  readonly timeline: WritableSignal<TimelineViewModel[]> = signal([]);
  readonly loaded = signal(false);
  readonly loading = signal(false);
  readonly length = signal<number | undefined>(undefined);

  constructor(
    private readonly nav: ProjectNavigationService,
    private readonly store: Store,
    private readonly timelineService: TimelineService
  ) {}

  private get projectId(): string {
    return this.store.selectSnapshot(ProjectState.current)!.id;
  }

  ngOnInit(): void {
    this.timelineService.getCountAsync(this.projectId).subscribe((count) => {
      this.length.set(count);

      if (count > 0) {
        this.loadMore();
      }
    });
  }

  timelineAction(item: TimelineMenuItem) {
    if (item.action === 'navigate') {
      this.nav.toTaskPage(item.objectId, TASK_PAGES.ABOUT);
    } else if (item.action === 'restore') {
      //this.store.dispatch(new RestoreProject(item.activityId));
    }
  }

  loadMore(): void {
    this.loading.set(true);

    const timeline = this.timeline();

    this.timelineService
      .loadMore(timeline, this.projectId)
      .subscribe((newTimeline) => {
        this.loading.set(false);
        this.timeline.set([...newTimeline]);
        this.loaded.set(true);
      });
  }
}

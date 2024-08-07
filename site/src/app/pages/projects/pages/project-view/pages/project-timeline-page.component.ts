import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TimelineMenuItem } from '@wbs/core/models';
import { TimelineViewModel } from '@wbs/core/view-models';
import { TimelineComponent } from '@wbs/components/timeline';
import { TimelineService } from '../services';

@Component({
  standalone: true,
  template: `<wbs-timeline
    [owner]="owner()"
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
  private readonly timelineService = inject(TimelineService);
  private readonly store = inject(Store);

  readonly owner = input.required<string>();
  readonly projectId = input.required<string>();
  readonly projectUrl = input.required<string[]>();
  readonly loaded = signal(false);
  readonly loading = signal(false);
  readonly timeline = signal<TimelineViewModel[]>([]);
  readonly length = signal<number | undefined>(undefined);

  ngOnInit(): void {
    this.timelineService.getCountAsync(this.projectId()).subscribe((count) => {
      this.length.set(count);

      if (count > 0) {
        this.loadMore();
      }
    });
  }

  timelineAction(item: TimelineMenuItem) {
    if (item.action === 'navigate') {
      this.store.dispatch(
        new Navigate([...this.projectUrl(), 'tasks', item.objectId])
      );
    } else if (item.action === 'restore') {
      //this.store.dispatch(new RestoreProject(item.activityId));
    }
  }

  loadMore(): void {
    this.loading.set(true);

    const timeline = this.timeline();

    this.timelineService
      .loadMore(timeline, this.projectId())
      .subscribe((newTimeline) => {
        this.loading.set(false);
        this.timeline.set([...newTimeline]);
        this.loaded.set(true);
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TimelineComponent } from '@wbs/components/timeline';
import { TimelineMenuItem } from '@wbs/core/models';
import { TimelineViewModel } from '@wbs/core/view-models';
import { TimelineService } from '../services';
import { ProjectStore } from '../stores';

@Component({
  standalone: true,
  template: `<div class="card dashboard-card w-100">
    <div class="card-header">Project Timeline</div>
    <div class="card-body">
      <wbs-timeline
        [owner]="owner"
        [length]="length()"
        [loaded]="loaded()"
        [loading]="loading()"
        [timeline]="timeline()"
        (loadMoreClicked)="loadMore()"
        (menuItemClicked)="timelineAction($event)"
      />
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent],
})
export class ProjectTimelinePageComponent implements OnInit {
  private readonly timelineService = inject(TimelineService);
  private readonly store = inject(ProjectStore);

  readonly loaded = signal(false);
  readonly loading = signal(false);
  readonly timeline = signal<TimelineViewModel[]>([]);
  readonly length = signal<number | undefined>(undefined);

  protected get owner(): string {
    return this.store.project()!.owner;
  }

  private get projectId(): string {
    return this.store.project()!.id;
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
      /*this.store.dispatch(
        new Navigate([...this.projectUrl(), 'tasks', item.objectId])
      );*/
    } else if (item.action === 'restore') {
      //this.store.dispatch(new RestoreProject(item.activityId));
    }
  }

  loadMore(): void {
    this.loading.set(true);

    const timeline = this.timeline();

    this.timelineService
      .loadMore(timeline, this.owner, this.projectId)
      .subscribe((newTimeline) => {
        this.loading.set(false);
        this.timeline.set([...newTimeline]);
        this.loaded.set(true);
      });
  }
}

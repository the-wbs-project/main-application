import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ActivityData, ProjectNode } from '@wbs/core/models';
import { Transformers } from '@wbs/core/services';
import {
  ProjectActivityRecord,
  ProjectViewModel,
  TimelineViewModel,
} from '@wbs/core/view-models';
import { UserStore } from '@wbs/core/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksState } from '../states';
import { ProjectStore } from '../stores';

@Injectable()
export class TimelineService {
  private readonly data = inject(DataServiceFactory);
  private readonly projectStore = inject(ProjectStore);
  private readonly store = inject(Store);
  private readonly transformer = inject(Transformers);
  private readonly userId = inject(UserStore).userId;
  private readonly take = 50;

  createProjectRecord(
    data: ActivityData,
    project?: ProjectViewModel,
    nodes?: ProjectNode[]
  ): ProjectActivityRecord {
    return {
      data,
      project: project ?? this.projectStore.project()!,
      nodes: nodes ?? this.store.selectSnapshot(TasksState.nodes)!,
    };
  }

  getCountAsync(topLevelId: string, objectId?: string): Observable<number> {
    return objectId
      ? this.data.activities.getChildCountAsync(topLevelId, objectId)
      : this.data.activities.getTopLevelCountAsync(topLevelId);
  }

  loadMore(
    list: TimelineViewModel[],
    topLevelId: string,
    objectId?: string
  ): Observable<TimelineViewModel[]> {
    const obs = objectId
      ? this.data.activities.getChildAsync(
          topLevelId,
          objectId,
          list.length,
          this.take
        )
      : this.data.activities.getTopLevelAsync(
          topLevelId,
          list.length,
          this.take
        );

    return obs.pipe(
      map((activities) => {
        if (list.length > 0) {
          //
          //  There may be repeats if the user did some actions THEN loaded more.
          //
          for (let i = 0; i < activities.length; i++) {
            if (list.some((x) => x.id === activities[i].id)) {
              //
              //  Remove and continue
              //
              activities.splice(i, 1);
              i--;
            } else {
              break;
            }
          }
        }
        list.push(
          ...activities.map((x) =>
            this.transformer.activities.toTimelineViewModel(x)
          )
        );
        return list;
      })
    );
  }

  saveProjectActions(data: ProjectActivityRecord[]): void {
    this.data.activities
      .saveProjectActivitiesAsync(this.userId()!, data)
      .subscribe();
  }
}

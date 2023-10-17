import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  ProjectActivityRecord,
  ProjectNode,
} from '@wbs/core/models';
import { TimelineViewModel } from '@wbs/core/view-models';
import { Transformers } from '@wbs/main/services';
import { AuthState } from '@wbs/main/states';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectState, TasksState } from '../states';

@Injectable()
export class TimelineService {
  private readonly take = 20;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store,
    private readonly transformer: Transformers
  ) {}

  createProjectRecord(
    data: ActivityData,
    project?: Project,
    nodes?: ProjectNode[]
  ): ProjectActivityRecord {
    return {
      data,
      project: project ?? this.store.selectSnapshot(ProjectState.current)!,
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
    const user = this.store.selectSnapshot(AuthState.profile)!;

    this.data.activities.saveProjectActivitiesAsync(user.id, data).subscribe();
  }
}

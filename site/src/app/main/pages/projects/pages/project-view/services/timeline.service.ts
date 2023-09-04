import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  ProjectActivityRecord,
  ProjectNode,
} from '@wbs/core/models';
import { Transformers } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { AuthState } from '@wbs/main/states';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  loadMore(
    list: TimelineViewModel[],
    topLevelId: string,
    objectId?: string
  ): Observable<TimelineViewModel[]> {
    return this.data.activities
      .getAsync(list.length, this.take, topLevelId, objectId)
      .pipe(
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
    const user = this.store.selectSnapshot(AuthState.profileLite)!;

    this.data.activities.saveProjectActivitiesAsync(user.id, data).subscribe();
  }
}

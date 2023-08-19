import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ActionDefinition, UserLite } from '@wbs/core/models';
import { Transformers } from '@wbs/core/services';
import { TimelineViewModel } from '@wbs/core/view-models';
import { MetadataState } from '@wbs/main/states';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private readonly take = 20;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store,
    private readonly transformer: Transformers
  ) {}

  loadMore(
    list: TimelineViewModel[],
    users: Map<string, UserLite>,
    topLevelId: string,
    objectId?: string
  ): Observable<void> {
    return this.data.activities
      .getAsync(list.length, this.take, topLevelId, objectId)
      .pipe(
        switchMap((activities) => {
          const idsToGet: string[] = [];

          for (const a of activities) {
            if (!users.has(a.userId) && idsToGet.indexOf(a.userId) === -1) {
              idsToGet.push(a.userId);
            }
          }
          const usersToGet = idsToGet.map((x) =>
            this.data.users.getLiteAsync(x)
          );

          return forkJoin({
            newUsers: forkJoin(usersToGet),
            activities: of(activities),
          });
        }),
        map(({ newUsers, activities }) => {
          for (const u of newUsers) {
            users.set(u.id, u);
          }

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
              this.transformer.activities.toTimelineViewModel(
                x,
                users.get(x.userId)!
              )
            )
          );
        })
      );
  }

  getIcon(actionId: string): string | undefined {
    return this.get(actionId)?.icon;
  }

  getTitle(actionId: string): string | undefined {
    return this.get(actionId)?.title;
  }

  getDescription(actionId: string): string | undefined {
    return this.get(actionId)?.description;
  }

  transformDescription(description: string, data: Record<string, any>): string {
    while (description.indexOf('{') > -1) {
      const start = description.indexOf('{');
      const end = description.indexOf('}', start);
      const property = description.substring(start + 1, end);

      description = description.replace(`{${property}}`, data[property]);
    }
    return description;
  }

  private get(actionId: string): ActionDefinition | undefined {
    return this.store.selectSnapshot(MetadataState.timeline).get(actionId);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataServiceFactory } from '../data-services';
import { Activity, TimelineMenuItem } from '../models';
import { TimelineViewModel } from '../view-models';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private readonly take = 20;

  constructor(private readonly data: DataServiceFactory) {}

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
          list.push(...activities.map((x) => this.transform(x)));
          return list;
        })
      );
  }

  private transform(act: Activity): TimelineViewModel {
    const menu: TimelineMenuItem[] = [];

    if (act.objectId) {
      menu.push({
        activityId: act.id,
        objectId: act.objectId,
        ...NAVIGATE_ITEM,
      });
    }
    menu.push({
      activityId: act.id,
      objectId: act.topLevelId,
      ...RESTORE_ITEM,
    });

    return {
      action: act.action,
      data: act.data,
      id: act.id,
      menu,
      objectId: act.objectId ?? act.topLevelId,
      timestamp: act.timestamp,
      userId: act.userId,
    };
  }
}

const NAVIGATE_ITEM = {
  action: 'navigate',
  icon: 'fa-eye',
  title: 'Projects.ViewTask',
};

const RESTORE_ITEM = {
  action: 'restore',
  icon: 'fa-window-restore',
  title: 'Projects.Restore',
};

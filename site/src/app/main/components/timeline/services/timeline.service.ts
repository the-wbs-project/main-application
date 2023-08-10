import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ActionDefinition, Activity, TimelineMenuItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/main/states';
import { TimelineViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private readonly take = 20;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

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

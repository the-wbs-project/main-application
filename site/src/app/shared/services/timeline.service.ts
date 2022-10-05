import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map, Observable, of } from 'rxjs';
import { ActionDefinition, Activity, LISTS } from '../models';
import { DataServiceFactory } from './data-services';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class TimelineService {
  private loaded = false;
  private definitions = new Map<string, ActionDefinition>();

  constructor(private readonly data: DataServiceFactory) {}

  sort(a: Activity, b: Activity): number {
    return b._ts - a._ts;
  }

  verifyAsync(): Observable<void | []> {
    if (this.loaded) return of([]);

    return this.data.metdata.getListAsync<ActionDefinition>(LISTS.ACTIONS).pipe(
      map((list) => {
        for (const x of list) {
          this.definitions.set(x.id, x);
        }
        this.loaded = true;
      })
    );
  }

  getIcon(actionId: string): string | undefined {
    return this.definitions.get(actionId)?.icon;
  }

  getTitle(actionId: string): string | undefined {
    return this.definitions.get(actionId)?.title;
  }

  getDescription(actionId: string): string | undefined {
    return this.definitions.get(actionId)?.description;
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

  /*getLabel(activity: ActivityData): string {
    return ''; 
    let label = this.resources.getExact(activity.labelTitle);
    let i = 0;

    if (!label) return 'NO LABEL AVAILBLE';

    while (label.indexOf(`{${i}}`) > -1 && activity.data[i]) {
      label = label.replace(`{${i}}`, activity.data[i]!.toString());
      i++;
    }
    return label;
  } */
}

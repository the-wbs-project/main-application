import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActionDefinition, Activity } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  constructor(private readonly store: Store) {}

  sort(a: Activity, b: Activity): number {
    return b.timestamp - a.timestamp;
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

import { Injectable } from '@angular/core';
import { ActivityData } from '../models';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private readonly resources: Resources) {}

  getLabel(activity: ActivityData): string {
    let label = this.resources.getExact(activity.labelTitle);
    let i = 0;

    if (!label) return 'NO LABEL AVAILBLE';

    while (label.indexOf(`{${i}}`) > -1 && activity.data[i]) {
      label = label.replace(`{${i}}`, activity.data[i]!.toString());
      i++;
    }
    return label;
  }
}

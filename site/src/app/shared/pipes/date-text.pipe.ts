import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/shared/services';
import * as dayjs from 'dayjs';

@Pipe({ name: 'dateText' })
export class DateTextPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(date: number | null | undefined): string {
    if (date == null) return '';

    const last = dayjs.utc(date);
    const now = dayjs.utc();
    let resource: string | undefined;
    let num: number | undefined;
    let minutes = now.diff(last, 'minute');

    if (minutes === 0) minutes = 1;

    if (minutes < 60) {
      resource =
        minutes === 1 ? 'General.EditedMinuteAgo' : 'General.EditedMinutesAgo';
      num = minutes;
    }
    //
    //  If today, show hours ago
    //
    else if (last.isSame(now, 'day')) {
      num = now.diff(last, 'hour');
      resource = num === 1 ? 'General.EditedHourAgo' : 'General.EditedHoursAgo';
    } else if (last.isSame(now.add(-1, 'day'), 'day')) {
      resource = 'General.EditedYesterday';
      num = 0;
    } else {
      resource = 'General.EditedDaysAgo';
      num = now.diff(last, 'day');
    }
    return resource
      ? this.resources.get(resource).replace('#', num.toString())
      : '';
  }
}

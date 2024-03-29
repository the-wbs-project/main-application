import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/core/services';
import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  isSameDay,
} from 'date-fns';

@Pipe({ name: 'editedDateText', standalone: true })
export class EditedDateTextPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(date: number | Date | null | undefined): string {
    if (date == null) return '';

    const last = new Date(date);
    const now = new Date();

    let resource: string | undefined;
    let num: number | undefined;
    let minutes = differenceInMinutes(now, last);

    if (minutes === 0) minutes = 1;

    if (minutes < 60) {
      resource =
        minutes === 1 ? 'General.EditedMinuteAgo' : 'General.EditedMinutesAgo';
      num = minutes;
    }
    //
    //  If today, show hours ago
    //
    else if (isSameDay(now, last)) {
      num = differenceInHours(now, last);
      resource = num === 1 ? 'General.EditedHourAgo' : 'General.EditedHoursAgo';
    } else {
      num = differenceInCalendarDays(now, last);

      if (num === 1) {
        resource = 'General.EditedYesterday';
        num = 0;
      } else {
        resource = 'General.EditedDaysAgo';
      }
    }
    return resource
      ? this.resources.get(resource).replace('#', num.toString())
      : '';
  }
}

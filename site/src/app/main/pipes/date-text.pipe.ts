import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/core/services';
import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  isSameDay,
} from 'date-fns';

@Pipe({ name: 'dateText', standalone: true })
export class DateTextPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(
    date: number | Date | null | undefined,
    isCountdown: boolean = false
  ): string {
    if (date == null) return '';

    const left = isCountdown ? new Date(date) : new Date();
    const right = isCountdown ? new Date() : new Date(date);

    console.log(left);
    console.log(right);
    console.log(isCountdown);

    let resource: string | undefined;
    let num: number | undefined;
    let minutes = differenceInMinutes(left, right);

    if (minutes === 0) minutes = 1;

    if (minutes < 60) {
      resource =
        'General.Minute' +
        (minutes === 1 ? '' : 's') +
        (isCountdown ? '' : 'Ago');

      num = minutes;
    }
    //
    //  If today, show hours ago
    //
    else if (isSameDay(left, right)) {
      num = differenceInHours(left, right);
      resource =
        'General.Hour' + (num === 1 ? '' : 's') + (isCountdown ? '' : 'Ago');
    } else {
      num = differenceInCalendarDays(left, right);

      if (num === 1) {
        resource = isCountdown ? 'General.Tomorrow' : 'General.Yesterday';
        num = 0;
      } else {
        resource = isCountdown ? 'General.Days' : 'General.DaysAgo';
      }
    }
    return resource
      ? this.resources
          .get(resource)
          .replace(
            '#',
            num.toLocaleString(undefined, { minimumFractionDigits: 0 })
          )
      : '';
  }
}

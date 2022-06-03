import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, toString } from '@telerik/kendo-intl';

@Pipe({ name: 'localDate' })
export class LocalDatePipe implements PipeTransform {
  transform(utcDate: number | Date | null, format: string): string | null {
    if (!utcDate) return null;

    //@ts-ignore
    return dayjs.utc(utcDate).local().format(format);
  }
}

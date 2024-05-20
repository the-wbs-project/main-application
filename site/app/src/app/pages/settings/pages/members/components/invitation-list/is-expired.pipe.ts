import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isExpired', standalone: true })
export class IsExpiredPipe implements PipeTransform {
  transform(date: number | Date | null | undefined): boolean {
    if (date == null) return false;

    return new Date(date) < new Date();
  }
}

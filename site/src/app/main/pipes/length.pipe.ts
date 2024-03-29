import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'length', pure: false, standalone: true })
export class LengthPipe implements PipeTransform {
  transform(list: any[] | undefined | null): number {
    return (list ?? []).length;
  }
}

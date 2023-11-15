import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'findThemById', standalone: true, pure: false })
export class FindThemByIdPipe implements PipeTransform {
  transform<T extends { id: string }>(
    list: T[] | undefined,
    ids: string[]
  ): T[] | undefined {
    return list?.filter((x) => ids.includes(x.id));
  }
}

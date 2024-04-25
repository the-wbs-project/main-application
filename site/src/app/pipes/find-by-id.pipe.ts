import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'findById', standalone: true, pure: false })
export class FindByIdPipe implements PipeTransform {
  transform<T extends { id: string }>(
    list: T[] | undefined,
    id: string
  ): T | undefined {
    return list?.find((x) => x.id === id);
  }
}

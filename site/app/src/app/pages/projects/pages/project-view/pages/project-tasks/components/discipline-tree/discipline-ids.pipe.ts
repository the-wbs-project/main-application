import { Pipe } from '@angular/core';
import { Category } from '@wbs/core/models';

@Pipe({ name: 'disciplineIds', standalone: true })
export class DisciplineIdsPipe {
  transform(disciplines: Category[] | undefined): string[] {
    return disciplines?.map((x) => (typeof x === 'string' ? x : x.id)) ?? [];
  }
}

import { Pipe } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';

@Pipe({ name: 'disciplineIds', standalone: true })
export class DisciplineIdsPipe {
  transform(disciplines: ProjectCategory[] | undefined): string[] {
    return disciplines?.map((x) => (typeof x === 'string' ? x : x.id)) ?? [];
  }
}

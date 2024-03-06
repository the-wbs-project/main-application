import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { MetadataState } from '../states';

@Pipe({ name: 'disciplineIcon', standalone: true })
export class DisciplineIconPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    idsOrCat: ProjectCategory | null | undefined,
    defaultIcon = 'fa-question'
  ): string {
    return (
      (typeof idsOrCat === 'string'
        ? this.store
            .selectSnapshot(MetadataState.categoryIcons)!
            .get(LISTS.DISCIPLINE)!
            .get(idsOrCat)
        : null) ?? defaultIcon
    );
  }
}

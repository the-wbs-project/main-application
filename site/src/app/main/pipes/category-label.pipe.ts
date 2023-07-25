import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectCategory } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';

@Pipe({ name: 'categoryLabel', pure: false, standalone: true })
export class CategoryLabelPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(idsOrCat: ProjectCategory | null | undefined): string {
    if (!idsOrCat) return '';
    if (typeof idsOrCat === 'string')
      return (
        this.store.selectSnapshot(MetadataState.categoryNames).get(idsOrCat) ??
        ''
      );

    return idsOrCat.label;
  }
}

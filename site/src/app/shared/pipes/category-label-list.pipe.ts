import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectCategory } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';

@Pipe({ name: 'categoryLabelList', pure: false })
export class CategoryLabelListPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(idsOrCat: ProjectCategory | null | undefined): string {
    if (!idsOrCat || typeof idsOrCat === 'string' || !idsOrCat.sameAs)
      return '';

    const items: string[] = [];

    for (const id of idsOrCat.sameAs) {
      const x =
        this.store.selectSnapshot(MetadataState.categoryNames).get(id) ?? '';

      if (x) items.push(x);
    }
    return items.join(', ');
  }
}

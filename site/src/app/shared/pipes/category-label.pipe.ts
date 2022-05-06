import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { MetadataState } from '@wbs/shared/states';
import { ListItem } from '../models';

@Pipe({ name: 'categoryLabel', pure: false })
export class CategoryLabelPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(idsOrCat: (string | ListItem) | null | undefined): string {
    if (!idsOrCat) return '';
    if (typeof idsOrCat === 'string')
      return (
        this.store.selectSnapshot(MetadataState.categoryNames).get(idsOrCat) ??
        ''
      );

    return idsOrCat.label;
  }
}

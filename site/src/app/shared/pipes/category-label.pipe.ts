import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { MetadataState } from '@wbs/states';

@Pipe({ name: 'categoryLabel', pure: false })
export class CategoryLabelPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(id: string | null | undefined): string {
    if (!id) return '';

    return this.store.selectSnapshot(MetadataState.categoryNames).get(id) ?? '';
  }
}

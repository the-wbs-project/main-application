import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { MetadataState } from '@wbs/core/states';

@Pipe({ name: 'categoryIcon', pure: false, standalone: true })
export class CategoryIconPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(idsOrCat?: string): string {
    return (
      this.store
        .selectSnapshot(MetadataState.categoryIcons)
        .get(idsOrCat ?? '') ?? ''
    );
  }
}

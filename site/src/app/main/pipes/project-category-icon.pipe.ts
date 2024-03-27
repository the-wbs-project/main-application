import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { LISTS } from '@wbs/core/models';
import { MetadataState } from '../states';

@Pipe({ name: 'projectCategoryIcon', standalone: true })
export class ProjectCategoryIconPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(idsOrCat: string | undefined): string {
    if (!idsOrCat) return '';
    
    return (
      this.store
        .selectSnapshot(MetadataState.categoryIcons)
        .get(LISTS.PROJECT_CATEGORIES)
        ?.get(idsOrCat ?? '') ?? ''
    );
  }
}

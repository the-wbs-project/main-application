import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { LISTS } from '@wbs/core/models';
import { MetadataState } from '../states';

@Pipe({ name: 'projectCategoryLabel', standalone: true })
export class ProjectCategoryLabelPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(id: string | null | undefined): string {
    if (!id) return '';

    return (
      this.store
        .selectSnapshot(MetadataState.categoryNames)
        .get(LISTS.PROJECT_CATEGORIES)!
        .get(id) ?? ''
    );
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectCategory } from '@wbs/core/models';
import { MetadataState } from '../states';

@Pipe({ name: 'categoryLabel', pure: false, standalone: true })
export class CategoryLabelPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    idsOrCat: ProjectCategory | null | undefined,
    projectCategories?: ProjectCategory[]
  ): string {
    if (!idsOrCat) return '';
    if (typeof idsOrCat !== 'string') return idsOrCat.label;

    const cName =
      this.store.selectSnapshot(MetadataState.categoryNames).get(idsOrCat) ??
      '';

    if (cName) return cName;

    if (projectCategories)
      for (const cat of projectCategories) {
        if (typeof cat !== 'string' && cat.id === idsOrCat) return cat.label;
      }
    return '??';
  }
}

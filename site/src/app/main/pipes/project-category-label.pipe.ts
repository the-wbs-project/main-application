import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectCategory } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { MetadataState } from '@wbs/main/states';

@Pipe({ name: 'projectCategoryLabel', standalone: true })
export class ProjectCategoryLabelPipe implements PipeTransform {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  transform(
    categoryId: string | undefined,
    categories: (CategorySelection | ProjectCategory)[]
  ): string {
    if (!categoryId) return '';

    console.log(categoryId);
    console.log(categories);

    for (const catOrId of categories) {
      if (typeof catOrId === 'string') {
        if (catOrId === categoryId) {
          console.log('getting');
          return this.resources.get(
            this.store
              .selectSnapshot(MetadataState.categoryNames)
              .get(catOrId) ?? ''
          );
        }
      } else if (catOrId.id === categoryId) {
        return catOrId.label;
      }
    }
    return '';
  }
}

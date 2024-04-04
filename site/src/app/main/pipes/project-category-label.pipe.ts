import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS } from '@wbs/core/models';
import { MetadataState } from '../services';

@Pipe({ name: 'projectCategoryLabel', standalone: true })
export class ProjectCategoryLabelPipe implements PipeTransform {
  private readonly state = inject(MetadataState);

  transform(id: string | null | undefined): string {
    if (!id) return '';

    return this.state.categories.getName(LISTS.PROJECT_CATEGORIES, id) ?? '';
  }
}

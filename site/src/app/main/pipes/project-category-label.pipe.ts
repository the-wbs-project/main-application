import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS } from '@wbs/core/models';
import { CategoryState } from '../services';

@Pipe({ name: 'projectCategoryLabel', standalone: true })
export class ProjectCategoryLabelPipe implements PipeTransform {
  private readonly state = inject(CategoryState);

  transform(id: string | null | undefined): string {
    if (!id) return '';

    return this.state.getName(LISTS.PROJECT_CATEGORIES, id) ?? '';
  }
}

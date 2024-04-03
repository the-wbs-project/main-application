import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS } from '@wbs/core/models';
import { CategoryState } from '../services';

@Pipe({ name: 'projectCategoryIcon', standalone: true })
export class ProjectCategoryIconPipe implements PipeTransform {
  private readonly state = inject(CategoryState);

  transform(id: string | null | undefined): string {
    if (!id) return '';

    return this.state.getIcon(LISTS.PROJECT_CATEGORIES, id) ?? '';
  }
}

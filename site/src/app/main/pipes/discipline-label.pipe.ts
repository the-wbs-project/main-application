import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { CategoryState } from '../services';

@Pipe({ name: 'disciplineLabel', standalone: true })
export class DisciplineLabelPipe implements PipeTransform {
  private readonly state = inject(CategoryState);

  transform(
    idsOrCat: ProjectCategory | null | undefined,
    projectCategories?: ProjectCategory[]
  ): string {
    if (!idsOrCat) return '';
    if (typeof idsOrCat !== 'string') return idsOrCat.label;

    const cName = this.state.getName(LISTS.DISCIPLINE, idsOrCat) ?? '';

    if (cName) return cName;

    if (projectCategories)
      for (const cat of projectCategories) {
        if (typeof cat !== 'string' && cat.id === idsOrCat) return cat.label;
      }
    return '??';
  }
}

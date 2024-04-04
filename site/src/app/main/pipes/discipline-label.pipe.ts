import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { MetadataState } from '../services';

@Pipe({ name: 'disciplineLabel', standalone: true })
export class DisciplineLabelPipe implements PipeTransform {
  private readonly state = inject(MetadataState);

  transform(
    idsOrCat: ProjectCategory | null | undefined,
    projectCategories?: ProjectCategory[]
  ): string {
    if (!idsOrCat) return '';
    if (typeof idsOrCat !== 'string') return idsOrCat.label;

    const cName =
      this.state.categories.getName(LISTS.DISCIPLINE, idsOrCat) ?? '';

    if (cName) return cName;

    if (projectCategories)
      for (const cat of projectCategories) {
        if (typeof cat !== 'string' && cat.id === idsOrCat) return cat.label;
      }
    return '??';
  }
}

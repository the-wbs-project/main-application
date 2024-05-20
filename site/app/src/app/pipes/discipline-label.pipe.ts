import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';

@Pipe({ name: 'disciplineLabel', standalone: true })
export class DisciplineLabelPipe implements PipeTransform {
  private readonly state = inject(MetadataStore);

  transform(
    category: ProjectCategory | string | undefined,
    categories?: ProjectCategory[] | undefined
  ): string {
    if (category == null) return '';
    if (typeof category !== 'string' && category.isCustom)
      return category.label;

    const id = typeof category === 'string' ? category : category.id;

    category = categories?.find((x) => x.id === id);

    if (category?.isCustom) return category.icon ?? '';

    return this.state.categories.getName(LISTS.DISCIPLINE, id) ?? '';
  }
}

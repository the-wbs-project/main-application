import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';

const question = 'fa-question';

@Pipe({ name: 'disciplineIcon', standalone: true })
export class DisciplineIconPipe implements PipeTransform {
  private readonly state = inject(MetadataStore);

  transform(
    category: ProjectCategory | string | undefined,
    categories: ProjectCategory[] | CategoryViewModel[] | undefined
  ): string {
    if (category == null) return question;
    if (typeof category !== 'string' && category.isCustom)
      return category.icon ?? question;

    const id = typeof category === 'string' ? category : category.id;

    category = categories?.find((x) => x.id === id);

    if (category?.isCustom) return category.icon ?? question;

    return this.state.categories.getIcon(LISTS.DISCIPLINE, id) ?? question;
  }
}

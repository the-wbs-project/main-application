import { Pipe, PipeTransform, inject } from '@angular/core';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { CategoryState } from '../services';

const question = 'fa-question';

@Pipe({ name: 'disciplineIcon', standalone: true })
export class DisciplineIconPipe implements PipeTransform {
  private readonly state = inject(CategoryState);

  transform(
    category: string | { id: string; icon?: string } | undefined,
    categories?: ProjectCategory[]
  ): string {
    if (category == null) return question;
    if (typeof category !== 'string') {
      return category.icon ?? this.getIconFromCats(category.id);
    }
    if (categories) {
      for (const cat of categories) {
        if (typeof cat === 'string') continue;

        if (cat.id === category) {
          return cat.icon ?? this.getIconFromCats(cat.id);
        }
      }
    }
    return this.getIconFromCats(category);
  }

  private getIconFromCats(id: string): string {
    return this.state.getIcon(LISTS.DISCIPLINE, id) ?? question;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { LISTS, ProjectCategory } from '@wbs/core/models';
import { MetadataState } from '../states';
import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';
import { faQuestion, fas } from '@fortawesome/pro-solid-svg-icons';

const question = faQuestion;

@Pipe({ name: 'disciplineIcon', standalone: true })
export class DisciplineIconPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    category: string | { id: string; icon?: string } | undefined,
    categories?: ProjectCategory[]
  ): IconProp {
    if (category == null) return question;
    if (typeof category !== 'string') {
      return category.icon
        ? fas[category.icon]
        : this.getIconFromCats(category.id);
    }
    if (categories) {
      for (const cat of categories) {
        if (typeof cat === 'string') continue;

        if (cat.id === category) {
          return cat.icon ? fas[cat.icon] : this.getIconFromCats(cat.id);
        }
      }
    }
    return this.getIconFromCats(category);
  }

  private getIconFromCats(id: string): IconProp {
    let name = this.store
      .selectSnapshot(MetadataState.categoryIcons)!
      .get(LISTS.DISCIPLINE)!
      .get(id);

    return name ? fas[name] : question;
  }
}

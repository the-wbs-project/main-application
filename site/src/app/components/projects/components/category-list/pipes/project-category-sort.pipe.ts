import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '@wbs/shared/models';

@Pipe({ name: 'projectCategorySort' })
export class ProjectCategorySortPipe implements PipeTransform {
  transform(
    cats: ListItem[] | null | undefined
  ): ListItem[] | null | undefined {
    if (cats == null) return cats;

    return cats.sort((a, b) => (a.label < b.label ? -1 : 1));
  }
}

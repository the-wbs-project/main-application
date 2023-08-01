import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';

@Pipe({ name: 'projectCategorySort', standalone: true })
export class ProjectCategorySortPipe implements PipeTransform {
  transform(
    cats: ListItem[] | null | undefined
  ): ListItem[] | null | undefined {
    if (cats == null) return cats;

    return cats.sort((a, b) => sorter(a.label, b.label));
  }
}

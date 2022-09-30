import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '@wbs/shared/models';

@Pipe({ name: 'projectCategoryFilter' })
export class ProjectCategoryFilterPipe implements PipeTransform {
  transform(
    cats: ListItem[] | null | undefined,
    search: string | null | undefined
  ): ListItem[] | null | undefined {
    if (cats == null || search == undefined) return cats;

    const s = search.toLowerCase();

    return cats.filter((x) => {
      return (
        x.label.toLowerCase().indexOf(s) > -1 ||
        (x.description ?? '').toLowerCase().indexOf(s) > -1
      );
    });
  }
}

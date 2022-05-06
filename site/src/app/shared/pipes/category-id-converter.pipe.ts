import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '../models';

@Pipe({ name: 'categoryIdConverter', pure: false })
export class CategoryIdConverterPipe implements PipeTransform {
  transform(
    cats: (string | ListItem)[] | null | undefined
  ): string[] | null | undefined {
    if (cats == null || cats == undefined) return cats;
    const ids: string[] = [];

    for (const cat of cats) {
      ids.push(typeof cat === 'string' ? cat : cat.id);
    }

    return ids;
  }
}

import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CAT_LISTS_TYPE,
  LISTS,
  LISTS_TYPE,
  ProjectCategory,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { CategorySelection } from '@wbs/shared/view-models';

@Injectable()
export class CategorySelectionService {
  constructor(private readonly store: Store) {}

  build(
    categoryType: PROJECT_NODE_VIEW_TYPE,
    selected: ProjectCategory[] | undefined
  ): CategorySelection[] {
    const cat =
      categoryType === PROJECT_NODE_VIEW.DISCIPLINE
        ? LISTS.DISCIPLINE
        : categoryType === PROJECT_NODE_VIEW.PHASE
        ? LISTS.PHASE
        : null;

    if (cat == null) return [];

    const categories = this.store
      .selectSnapshot(MetadataState.categoryList)
      .get(cat)!;

    const cats: CategorySelection[] = [];

    for (const cat of categories) {
      cats.push({
        id: cat.id,
        label: cat.label,
        description: cat.description ?? '',
        number: null,
        selected: false,
        isCustom: false,
      });
    }
    const usedIds: string[] = [];
    const items: CategorySelection[] = [];

    for (const x of selected ?? []) {
      if (typeof x === 'string') {
        const cat = cats.find((c) => c.id === x);

        if (cat) {
          items.push({
            id: cat.id,
            label: cat.label,
            description: cat.description ?? '',
            number: null,
            selected: true,
            isCustom: false,
          });
          usedIds.push(x);
        }
      } else {
        items.push({
          id: x.id,
          label: x.label,
          description: x.description ?? '',
          number: null,
          selected: true,
          isCustom: true,
        });
        usedIds.push(x.id);
      }
    }

    for (const cat of cats) {
      if (usedIds.indexOf(cat.id) > -1) continue;

      items.push({
        id: cat.id,
        label: cat.label,
        description: cat.description ?? '',
        number: null,
        selected: false,
        isCustom: false,
      });
    }
    this.renumber(items);

    console.log(categories);
    console.log(items);
    return items;
  }

  buildFromList(
    categoryType: PROJECT_NODE_VIEW_TYPE,
    list: ProjectCategory[],
    selected: string[]
  ): CategorySelection[] {
    const cat =
      categoryType === PROJECT_NODE_VIEW.DISCIPLINE
        ? LISTS.DISCIPLINE
        : categoryType === PROJECT_NODE_VIEW.PHASE
        ? LISTS.PHASE
        : null;

    if (cat == null) return [];

    const categories = this.store
      .selectSnapshot(MetadataState.categoryList)
      .get(cat)!;

    const cats: CategorySelection[] = [];

    for (const x of list) {
      if (typeof x === 'string') {
        const cat = categories.find((c) => c.id === x);

        if (cat) {
          cats.push({
            id: cat.id,
            label: cat.label,
            description: cat.description ?? '',
            number: null,
            selected: selected.indexOf(x) > -1,
            isCustom: false,
          });
        }
      } else {
        cats.push({
          id: x.id,
          label: x.label,
          description: x.description ?? '',
          number: null,
          selected: selected.indexOf(x.id) > -1,
          isCustom: true,
        });
      }
    }
    this.renumber(cats);

    return cats;
  }

  extract(
    categories: CategorySelection[] | undefined,
    idsOnly: boolean
  ): ProjectCategory[] {
    const ids: ProjectCategory[] = [];

    if (categories)
      for (const x of categories) {
        if (!x.selected) continue;
        if (!x.isCustom || idsOnly) ids.push(x.id);
        else
          ids.push({
            id: x.id,
            label: x.label,
            type: 'Custom',
            description: x.description,
            tags: [],
          });
      }
    return ids;
  }

  renumber(categories: CategorySelection[] | undefined): void {
    let i = 1;

    if (!categories) return;

    for (const item of categories) {
      if (item.selected) {
        item.number = i;
        i++;
      } else {
        item.number = null;
      }
    }
  }
}

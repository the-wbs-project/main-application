import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  Category,
  LISTS,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  ProjectCategory,
  ProjectCategoryChanges,
} from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import {
  CategoryCancelConfirm,
  CategorySelection,
} from '@wbs/core/view-models';
import { MetadataState } from '../states';

@Injectable()
export class CategorySelectionService {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  isListDirty(list: CategorySelection[] | undefined): boolean {
    return (
      list?.some((x) => x.selected !== (x.originalSelection ?? false)) ?? false
    );
  }

  build(
    categories: Category[],
    selected: ProjectCategory[] | undefined,
    confirmMessage?: string,
    catCounts?: Map<string, number>
  ): CategorySelection[] {
    const cats: CategorySelection[] = [];

    for (const cat of categories) {
      cats.push({
        id: cat.id,
        label: this.resources.get(cat.label),
        description: cat.description
          ? this.resources.get(cat.description)
          : undefined,
        icon: cat.icon,
        selected: false,
        originalSelection: false,
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
            description: cat.description,
            icon: cat.icon,
            selected: true,
            originalSelection: true,
            isCustom: false,
            confirm: this.createConfirm(cat.id, confirmMessage, catCounts),
          });
          usedIds.push(x);
        }
      } else {
        items.push({
          id: x.id,
          label: x.label,
          description: x.description,
          icon: x.icon,
          selected: true,
          originalSelection: true,
          isCustom: true,
          confirm: this.createConfirm(x.id, confirmMessage, catCounts),
        });
        usedIds.push(x.id);
      }
    }

    for (const cat of cats) {
      if (usedIds.indexOf(cat.id) > -1) continue;

      items.push({
        id: cat.id,
        label: cat.label,
        description: cat.description,
        icon: cat.icon,
        selected: false,
        originalSelection: false,
        isCustom: false,
      });
    }
    this.renumber(items);

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
            label: this.resources.get(cat.label),
            description: cat.description
              ? this.resources.get(cat.description)
              : undefined,
            selected: selected.indexOf(x) > -1,
            originalSelection: selected.indexOf(x) > -1,
            isCustom: false,
          });
        }
      } else {
        cats.push({
          id: x.id,
          label: x.label,
          description: x.description,
          selected: selected.indexOf(x.id) > -1,
          originalSelection: selected.indexOf(x.id) > -1,
          isCustom: true,
        });
      }
    }
    this.renumber(cats);

    return cats;
  }

  extract(
    viewModels: CategorySelection[] | undefined,
    originals: ProjectCategory[]
  ): ProjectCategoryChanges {
    const categories: ProjectCategory[] = [];
    const removedIds: string[] = [];

    if (viewModels)
      for (const x of viewModels) {
        if (!x.selected) {
          //
          //  If this item was in the originals, add to removed Ids list
          //
          if (
            originals.some(
              (cat) => x.id === (typeof cat === 'string' ? cat : cat.id)
            )
          ) {
            removedIds.push(x.id);
          }
          continue;
        }
        if (!x.isCustom) categories.push(x.id);
        else
          categories.push({
            id: x.id,
            label: x.label,
            description: x.description,
            icon: x.icon,
          });
      }
    return { categories, removedIds };
  }

  extractIds(categories: CategorySelection[] | undefined): string[] {
    const ids: string[] = [];

    if (categories)
      for (const x of categories) {
        if (!x.selected) continue;

        ids.push(x.id);
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
        item.number = undefined;
      }
    }
  }

  private createConfirm(
    id: string,
    confirmMessage?: string,
    catCounts?: Map<string, number>
  ): CategoryCancelConfirm | undefined {
    const x = catCounts?.get(id) ?? 0;

    if (x === 0 || !confirmMessage) return undefined;

    return {
      label: confirmMessage,
      data: {
        count: x.toString(),
      },
    };
  }
}

import { Injectable, inject } from '@angular/core';
import {
  Category,
  ProjectCategory,
  ProjectCategoryChanges,
} from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import {
  CategoryCancelConfirm,
  CategorySelection,
} from '@wbs/core/view-models';

@Injectable({ providedIn: 'root' })
export class CategorySelectionService {
  private readonly metadata = inject(MetadataStore);

  isListDirty(list: CategorySelection[] | undefined): boolean {
    return (
      list?.some((x) => x.selected !== (x.originalSelection ?? false)) ?? false
    );
  }

  buildPhases(
    selected: ProjectCategory[] | undefined,
    confirmMessage?: string,
    catCounts?: Map<string, number>
  ): CategorySelection[] {
    return this.build(
      this.metadata.categories.phases,
      selected,
      confirmMessage,
      catCounts
    );
  }

  buildDisciplines(
    selected: ProjectCategory[] | undefined,
    confirmMessage?: string,
    catCounts?: Map<string, number>
  ): CategorySelection[] {
    return this.build(
      this.metadata.categories.disciplines,
      selected,
      confirmMessage,
      catCounts
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
        label: cat.label,
        description: cat.description,
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

  buildDisciplinesFromList(
    list: ProjectCategory[],
    selected: string[]
  ): CategorySelection[] {
    return this.buildFromList(
      this.metadata.categories.disciplines,
      list,
      selected
    );
  }

  buildPhasesFromList(
    list: ProjectCategory[],
    selected: string[]
  ): CategorySelection[] {
    return this.buildFromList(this.metadata.categories.phases, list, selected);
  }

  buildFromList(
    categories: Category[],
    list: ProjectCategory[],
    selected: string[]
  ): CategorySelection[] {
    const cats: CategorySelection[] = [];

    for (const x of list) {
      if (typeof x === 'string') {
        const cat = categories.find((c) => c.id === x);

        if (cat) {
          cats.push({
            id: cat.id,
            label: cat.label,
            description: cat.description,
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

  add(list: CategorySelection[], item: CategorySelection): CategorySelection[] {
    list = [item, ...list];

    this.renumber(list);

    return list;
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

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EntryStore, MetadataStore } from '@wbs/store';

export const disciplineListResolver: ResolveFn<
  { id: string; label: string }[]
> = () => {
  const entryStore = inject(EntryStore);
  const categories = inject(MetadataStore).categories.disciplines;

  const items: { id: string; label: string }[] = [];

  for (const category of entryStore.version()?.disciplines ?? []) {
    if (typeof category !== 'string') {
      items.push({
        id: category.id,
        label: category.label,
      });
    }
  }
  for (const category of categories) {
    if (!items.find((item) => item.id === category.id)) {
      items.push({
        id: category.id,
        label: category.label,
      });
    }
  }
  return items;
};

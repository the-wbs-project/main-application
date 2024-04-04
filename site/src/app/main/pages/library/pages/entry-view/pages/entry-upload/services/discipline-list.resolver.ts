import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MetadataState } from '@wbs/main/services';
import { EntryState } from '../../../services';

export const disciplineListResolver: ResolveFn<
  { id: string; label: string }[]
> = () => {
  const state = inject(EntryState);
  const categories = inject(MetadataState).categories.disciplines;

  const items: { id: string; label: string }[] = [];

  for (const category of state.version()?.disciplines ?? []) {
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

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { MetadataState } from '@wbs/main/states';
import { EntryState } from '../../../services';

export const disciplineListResolver: ResolveFn<
  { id: string; label: string }[]
> = () => {
  const state = inject(EntryState);
  const store = inject(Store);
  const resources = inject(Resources);
  const categories = store.selectSnapshot(MetadataState.disciplines);

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
        label: resources.get(category.label),
      });
    }
  }
  return items;
};

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { map } from 'rxjs';
import { ProjectUploadState } from '../states';
import { MetadataState } from '@wbs/main/services';

export const disciplineListResolver: ResolveFn<
  { id: string; label: string }[]
> = () => {
  const store = inject(Store);
  const resources = inject(Resources);
  const categories = inject(MetadataState).categories.disciplines;

  return store.selectOnce(ProjectUploadState.current).pipe(
    map((project) => {
      const items: { id: string; label: string }[] = [];

      for (const category of project!.disciplines) {
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
    })
  );
};

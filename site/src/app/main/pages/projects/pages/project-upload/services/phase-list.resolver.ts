import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { MetadataState } from '@wbs/main/states';
import { forkJoin, map } from 'rxjs';
import { ProjectUploadState } from '../states';

export const phaseListResolver: ResolveFn<
  { id: string; label: string }[]
> = () => {
  const store = inject(Store);
  const resources = inject(Resources);

  return forkJoin({
    categories: store.selectOnce(MetadataState.phases),
    project: store.selectOnce(ProjectUploadState.current),
  }).pipe(
    map(({ categories, project }) => {
      const items: { id: string; label: string }[] = [];

      for (const category of project?.phases ?? []) {
        if (typeof category === 'string') {
          const cat = categories.find((c) => c.id === category)!;
          items.push({
            id: cat.id,
            label: resources.get(cat.label),
          });
        } else {
          items.push({
            id: category.id,
            label: category.label,
          });
        }
      }
      return items;
    })
  );
};

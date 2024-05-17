import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectCategory } from '@wbs/core/models';
import { EntryStore, MetadataStore } from '@wbs/core/store';

export const disciplineListResolver: ResolveFn<ProjectCategory[]> = () => {
  const entryStore = inject(EntryStore);
  const categories = inject(MetadataStore).categories.disciplines;

  return [
    ...(entryStore.version()?.disciplines?.filter((x) => x.isCustom) ?? []),
    ...categories.map((x) => <ProjectCategory>{ id: x.id, isCustom: false }),
  ];
};

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProjectCategory } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { ProjectUploadState } from '../states';

export const disciplineListResolver: ResolveFn<ProjectCategory[]> = () => {
  const store = inject(Store);
  const categories = inject(MetadataStore).categories.disciplines;
  const project = store.selectSnapshot(ProjectUploadState.current);

  return [
    ...project!.disciplines.filter((category) => category.isCustom),
    ...categories.map((d) => <ProjectCategory>{ id: d.id, isCustom: false }),
  ];
};

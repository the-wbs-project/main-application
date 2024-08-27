import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectCategory } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { ProjectStore } from '../../../stores';

export const disciplineListResolver: ResolveFn<ProjectCategory[]> = () => {
  const categories = inject(MetadataStore).categories.disciplines;
  const project = inject(ProjectStore).project();

  return [
    ...project!.disciplines.filter((category) => category.isCustom),
    ...categories.map((d) => <ProjectCategory>{ id: d.id, isCustom: false }),
  ];
};

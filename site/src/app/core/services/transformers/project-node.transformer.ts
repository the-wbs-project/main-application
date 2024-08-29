import { ProjectNode } from '@wbs/core/models';
import { ProjectTaskViewModel } from '@wbs/core/view-models';

export class ProjectTaskTransformer {
  static toModel(projectId: string, vm: ProjectTaskViewModel): ProjectNode {
    const model: ProjectNode = {
      id: vm.id,
      description: vm.description,
      projectId: projectId,
      absFlag: vm.absFlag === 'set',
      title: vm.title,
      order: vm.order,
      lastModified: vm.lastModified ?? new Date(),
      createdOn: vm.createdOn,
      disciplineIds: vm.disciplines.map((d) => d.id),
      libraryLink: vm.libraryLink,
      libraryTaskLink: vm.libraryTaskLink,
      parentId: vm.parentId,
      phaseIdAssociation: vm.phaseIdAssociation,
    };
    return model;
  }
}

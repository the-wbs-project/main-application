import { Project } from '@wbs/core/models';
import { ProjectViewModel } from '@wbs/core/view-models';

export class ProjectTransformer {
  static toModel(vm: ProjectViewModel): Project {
    const model: Project = {
      id: vm.id,
      recordId: vm.recordId,
      owner: vm.owner,
      createdBy: vm.createdBy.userId,
      lastModified: vm.lastModified,
      title: vm.title,
      description: vm.description,
      disciplines: vm.disciplines,
      category: vm.category,
      status: vm.status,
      mainNodeView: vm.mainNodeView,
      createdOn: vm.createdOn,
      approvalStarted: vm.approvalStarted,
      libraryLink: vm.libraryLink,
      roles: vm.roles.map((r) => ({
        userId: r.user.userId,
        role: r.role,
      })),
    };
    return model;
  }
}

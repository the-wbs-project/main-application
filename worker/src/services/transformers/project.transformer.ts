import { Project, User } from '../../models';
import { ProjectViewModel } from '../../view-models';

export class ProjectTransformer {
  static toViewModel(project: Project, users: User[]): ProjectViewModel {
    return {
      id: project.id,
      recordId: project.recordId,
      owner: project.owner,
      createdBy: users.find((u) => u.userId === project.createdBy)!,
      title: project.title,
      description: project.description,
      createdOn: project.createdOn,
      lastModified: project.lastModified,
      approvalStarted: project.approvalStarted,
      status: project.status,
      mainNodeView: project.mainNodeView,
      category: project.category,
      disciplines: project.disciplines,
      libraryLink: project.libraryLink,
      roles: project.roles.map((r) => ({
        user: users.find((u) => u.userId === r.userId)!,
        role: r.role,
      })),
    };
  }
}
